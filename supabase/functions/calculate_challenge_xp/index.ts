import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
}

// Helper function to calculate average rating
function calculateAverage(ratings: number[]): number {
    if (ratings.length === 0) return 0;
    const sum = ratings.reduce((a, b) => a + b, 0);
    return sum / ratings.length;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  // 1. Authentication (Service Role is required for database updates)
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  )

  try {
    const { challenge_id } = await req.json();

    if (!challenge_id) {
      return new Response(JSON.stringify({ error: 'Missing challenge_id' }), {
        status: 400,
        headers: corsHeaders,
      })
    }

    // 2. Fetch Challenge Details (Max Points)
    const { data: challenge, error: challengeError } = await supabaseClient
      .from('challenges')
      .select('max_points')
      .eq('id', challenge_id)
      .single();

    if (challengeError || !challenge) {
      console.error("Challenge fetch error:", challengeError);
      return new Response(JSON.stringify({ error: 'Challenge not found or failed to fetch details.' }), {
        status: 404,
        headers: corsHeaders,
      })
    }
    
    const maxChallengePoints = challenge.max_points;

    // 3. Fetch all ratings for submissions belonging to this challenge
    const { data: ratingsData, error: ratingsError } = await supabaseClient
      .from('challenge_ratings')
      .select(`
        rating,
        user_challenges (user_id, challenge_id)
      `)
      .eq('user_challenges.challenge_id', challenge_id); // Filter by challenge_id via the join

    if (ratingsError) {
      console.error("Ratings fetch error:", ratingsError);
      return new Response(JSON.stringify({ error: 'Failed to fetch ratings.' }), {
        status: 500,
        headers: corsHeaders,
      })
    }

    // 4. Calculate Average Rating per User (based on the submission user_id)
    const userRatingsMap = new Map<string, number[]>();
    
    for (const ratingEntry of ratingsData) {
      const userId = ratingEntry.user_challenges?.user_id;
      const rating = ratingEntry.rating;
      
      if (userId) {
        if (!userRatingsMap.has(userId)) {
          userRatingsMap.set(userId, []);
        }
        userRatingsMap.get(userId)?.push(rating);
      }
    }

    const userAverages = new Map<string, number>();
    let maxAverageRating = 0;

    for (const [userId, userRatings] of userRatingsMap.entries()) {
      const avg = calculateAverage(userRatings);
      userAverages.set(userId, avg);
      if (avg > maxAverageRating) {
        maxAverageRating = avg;
      }
    }
    
    // Handle case where no submissions were rated
    if (maxAverageRating === 0) {
        return new Response(JSON.stringify({ message: 'No ratings found for submitted projects. XP distribution skipped.' }), {
            status: 200,
            headers: corsHeaders,
        });
    }

    // 5. Calculate and Award XP
    const results = [];
    
    for (const [userId, averageRating] of userAverages.entries()) {
      // Calculate proportional XP: (User Avg / Max Avg) * Max Challenge Points
      const proportionalXp = Math.round((averageRating / maxAverageRating) * maxChallengePoints);
      
      // 5a. Update user_challenges record with awarded XP
      const { error: updateUCError } = await supabaseClient
        .from('user_challenges')
        .update({ 
            xp_awarded: proportionalXp,
            status: 'completed' // Mark as completed after XP is awarded
        })
        .eq('challenge_id', challenge_id)
        .eq('user_id', userId);

      if (updateUCError) {
        console.error(`Failed to update user_challenges for user ${userId}:`, updateUCError);
        results.push({ userId, status: 'failed_update_user_challenges' });
        continue;
      }
      
      // 5b. Update user_stats (XP and challenges completed count)
      const { error: updateStatsError } = await supabaseClient.rpc('update_user_xp', {
          p_user_id: userId,
          p_xp_awarded: proportionalXp,
          p_challenges_completed_increment: 1,
      });

      if (updateStatsError) {
        console.error(`Failed to update user_stats for user ${userId}:`, updateStatsError);
        results.push({ userId, status: 'failed_update_user_stats' });
        continue;
      }

      results.push({ userId, xp_awarded: proportionalXp, status: 'success' });
    }

    return new Response(JSON.stringify({ 
        message: 'XP distribution complete.', 
        results,
        max_average_rating: maxAverageRating
    }), {
      status: 200,
      headers: corsHeaders,
    })

  } catch (error) {
    console.error("Edge Function execution error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: corsHeaders,
    })
  }
})
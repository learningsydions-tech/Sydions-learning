import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useSession } from '@/contexts/SessionContext'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const LoginPage = () => {
  const { session, supabase } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/dashboard'); // Redirect to /dashboard instead of /
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <Button variant="link" className="p-0 h-auto text-muted-foreground hover:text-foreground" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <div className="flex flex-col items-center">
          <img src="/Sydions_logo.jpg" alt="Sydions Logo" className="h-16 w-16 mb-4 rounded-full" />
          <h1 className="text-2xl font-bold text-center text-primary">
            Welcome to Sydions
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in or create an account to continue
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary))',
                  brandButtonText: 'hsl(var(--primary-foreground))',
                  defaultButtonBackground: 'hsl(var(--card))',
                  defaultButtonBackgroundHover: 'hsl(var(--muted))',
                  defaultButtonBorder: 'hsl(var(--border))',
                  defaultButtonText: 'hsl(var(--foreground))',
                  dividerBackground: 'hsl(var(--border))',
                  inputBackground: 'hsl(var(--input))',
                  inputBorder: 'hsl(var(--border))',
                  inputBorderHover: 'hsl(var(--ring))',
                  inputBorderFocus: 'hsl(var(--ring))',
                  inputText: 'hsl(var(--foreground))',
                  inputLabelText: 'hsl(var(--muted-foreground))',
                  inputPlaceholder: 'hsl(var(--muted-foreground))',
                  messageText: 'hsl(var(--muted-foreground))',
                  messageTextDanger: 'hsl(var(--destructive))',
                  anchorTextColor: 'hsl(var(--muted-foreground))',
                  anchorTextHoverColor: 'hsl(var(--foreground))',
                },
              },
            },
          }}
          providers={['google']}
          socialLayout="horizontal"
        />
      </div>
    </div>
  )
}

export default LoginPage;
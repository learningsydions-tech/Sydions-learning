import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useSession } from '@/contexts/SessionContext'

const LoginPage = () => {
  const { session, supabase } = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg">
        <div>
          <h1 className="text-2xl font-bold text-center text-primary">
            Welcome to Sydions
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Sign in or create an account to continue
          </p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          theme="dark"
          socialLayout="horizontal"
        />
      </div>
    </div>
  )
}

export default LoginPage;
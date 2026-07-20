import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
// 🌟 Added Eye and EyeOff to your imports here:
import { Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    
    // Validate email domain before sending request
    if (!email.toLowerCase().endsWith('@mlrit.ac.in')) {
      toast.error("Only MLRIT college emails (@mlrit.ac.in) are allowed!");
      return;
    }
    
    const toastId = toast.loading("Verifying with database...");
    
    try {
      const payload = {
        email: email.trim().toLowerCase(),
        studentEmail: email.trim().toLowerCase(),
        password: password.trim().toUpperCase(),
        htNo: password.trim().toUpperCase()
      };

      const response = await axios.post("https://mlrit-counseling-portal.onrender.com/api/auth/login", payload);

      localStorage.setItem('studentHtNo', response.data.student?.htNo || payload.htNo);
      localStorage.setItem('studentName', response.data.student?.name || 'Student');

      toast.success(`Login Successful!`, { id: toastId });
      navigate('/dashboard');
      
    } catch (error) {
      console.error("Login Error:", error.response?.data || error.message);
      
      if (error.response) {
        toast.error(error.response.data.message || "Invalid Email or Roll Number!", { id: toastId });
      } else {
        toast.error("Server is waking up... Please wait 30 seconds and try again! ⏳", { id: toastId });
      }
    }
  };

  // Google OAuth using useGoogleLogin hook
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Get user info from Google
        const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });

        // Validate email domain after user selects account
        if (!userInfo.data.email.toLowerCase().endsWith('@mlrit.ac.in')) {
          toast.error("Access denied! Only MLRIT college emails (@mlrit.ac.in) are allowed.");
          return;
        }

        const response = await axios.post("https://mlrit-counseling-portal.onrender.com/api/auth/google", {
          email: userInfo.data.email,
          name: userInfo.data.name,
          googleId: userInfo.data.sub
        });

        localStorage.setItem('studentHtNo', response.data.student?.htNo || response.data.student?.studentEmail || '');
        localStorage.setItem('studentEmail', response.data.student?.studentEmail || userInfo.data.email);
        localStorage.setItem('studentName', response.data.student?.name || userInfo.data.name);
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('isGoogleAuth', 'true');

        toast.success(`Welcome ${userInfo.data.name}!`);
        navigate('/dashboard');
        
      } catch (error) {
        console.error("Google Login Error:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "Google login failed!");
      }
    },
    onError: () => {
      toast.error("Google login cancelled or failed!");
    },
    flow: 'implicit',
    prompt: 'select_account',
    hint: '',
    hosted_domain: ''
  });

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT — brand panel */}
      <div className="brand-panel hidden lg:flex flex-col justify-between p-14">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full border border-white/10" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-accent/80 [clip-path:polygon(100%_0,100%_100%,0_100%)]" />

        <div className="relative z-10 bg-white/95 p-4 rounded-xl w-40 h-24 flex items-center justify-center">
          <img src="/mlrit-logo.png" alt="MLRIT Logo" className="max-h-full max-w-full object-contain" />
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-extrabold leading-tight text-white/95">
            Welcome back.
          </h2>
          <p className="text-white/60 mt-4 max-w-sm leading-relaxed">
            Sign in to access your academic records, analytics and counseling history.
          </p>
        </div>
        <p className="relative z-10 text-white/40 text-xs">MLR Institute of Technology</p>
      </div>

      {/* RIGHT — form */}
      <div className="flex items-center justify-center p-8 sm:p-14 bg-canvas">
        <div className="w-full max-w-md animate-fade-in">
          <div className="lg:hidden bg-white border border-slate-200 p-4 rounded-xl w-36 h-20 flex items-center justify-center mb-8">
            <img src="/mlrit-logo.png" alt="MLRIT Logo" className="max-h-full max-w-full object-contain" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Student Portal</h1>
          <p className="text-slate-500 mt-2 mb-8">Log in with your MLRIT college account.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="label-text">College Email</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@mlrit.ac.in"
                  pattern="[a-zA-Z0-9._%+-]+@mlrit\.ac\.in$"
                  title="Please enter a valid MLRIT email address (e.g., student@mlrit.ac.in)"
                  className="input-field pl-11"
                  required
                />
              </div>
            </div>

            <div>
              <label className="label-text">Password (Roll Number)</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter Roll Number"
                  className="input-field pl-11 pr-11 uppercase"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-primary cursor-pointer">
              Access Portal <ArrowRight size={18} />
            </button>
          </form>

          {/* Google OAuth Button */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-canvas text-slate-400 font-medium tracking-wide uppercase">or continue with</span>
              </div>
            </div>

            <button
              onClick={() => googleLogin()}
              type="button"
              className="btn-ghost mt-6 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-200 text-center text-sm">
            <span className="text-slate-500">Don't have an account yet? </span>
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Create student account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
      <LoginForm />
    </GoogleOAuthProvider>
  );
}
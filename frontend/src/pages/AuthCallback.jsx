import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const TOKEN_KEY = 'devlens_token';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setError('No token received from GitHub sign-in. Try again.');
      return;
    }

    localStorage.setItem(TOKEN_KEY, token);
    navigate('/dashboard', { replace: true });
  }, [searchParams, navigate]);

  if (error) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] px-4 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-700/[0.08] blur-[150px]" />
          <div className="absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-blue-700/[0.06] blur-[160px]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,7,0.9),transparent)]" />
        </div>

        <main className="relative z-10 max-w-md text-center">
          <div className="font-mono text-sm uppercase tracking-[0.35em] text-[#a78bfa]">
            DEV<span className="text-[#8b5cf6]">LENS</span>
          </div>

          <div className="mt-12 font-mono text-xs uppercase tracking-[0.25em] text-red-400">
            Sign-in failed
          </div>

          <p className="mt-4 text-sm leading-6 text-[#8b8e98]">
            {error}
          </p>

          <a
            href="/login"
            className="mt-8 inline-flex rounded-full border border-[#8b5cf6]/60 px-6 py-3 font-mono text-xs text-[#c4b5fd] transition hover:border-[#a78bfa] hover:bg-[#a78bfa]/10"
          >
            ← back to sign in
          </a>
        </main>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] px-4 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-700/[0.08] blur-[150px]" />
        <div className="absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-blue-700/[0.06] blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,7,0.9),transparent)]" />
      </div>

      <main className="relative z-10 flex flex-col items-center text-center">
        <div className="font-mono text-2xl font-medium uppercase tracking-[0.45em] text-[#b993ff]">
          DEV<span className="text-[#8b5cf6]">LENS</span>
        </div>

        <div className="mt-10 flex items-center gap-3 font-mono text-xs text-[#8b8e98]">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#a78bfa]" />
          signing you in…
        </div>
      </main>
    </div>
  );
}
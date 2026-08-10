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
      <div className="flex min-h-screen items-center justify-center bg-[#0B0E14] px-4">
        <div className="max-w-sm text-center">
          <div className="font-mono text-lg text-[#F85149]">Sign-in failed</div>
          <p className="mt-2 text-sm text-[#8B93A7]">{error}</p>
          <a
            href="/login"
            className="mt-4 inline-block rounded border border-[#A78BFA]/40 px-4 py-2 font-mono text-xs text-[#A78BFA] transition hover:bg-[#A78BFA]/10"
          >
            back to sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0B0E14] px-4">
      <div className="font-mono text-sm text-[#8B93A7]">signing you in…</div>
    </div>
  );
}
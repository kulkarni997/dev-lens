import { useMemo } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const STAR_COLORS = [
  '#ffffff',
  '#c4b5fd',
  '#a5b4fc',
  '#93c5fd',
  '#f9a8d4',
  '#fda4af',
  '#fdba74',
];

export default function Login() {
  function handleSignIn() {
    // Full page redirect on purpose — GitHub's OAuth consent screen has to be a
    // real navigation, not something you can fetch() into an API call.
    window.location.href = `${API_BASE_URL}/auth/github`;
  }

  const stars = useMemo(() => {
    return Array.from({ length: 95 }, (_, i) => {
      const color =
        STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)];

      return {
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: Math.random() < 0.85 ? Math.random() * 1.6 + 0.5 : Math.random() * 3 + 1.5,
        opacity: Math.random() * 0.55 + 0.2,
        color,
        duration: Math.random() * 12 + 8,
        delay: Math.random() * -15,
        driftX: (Math.random() - 0.5) * 140,
        driftY: (Math.random() - 0.5) * 100,
      };
    });
  }, []);

  const glowingStars = useMemo(() => {
    return Array.from({ length: 16 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      size: Math.random() * 3 + 3,
      duration: Math.random() * 5 + 4,
      delay: Math.random() * -8,
    }));
  }, []);

  const shootingStars = useMemo(() => {
    return Array.from({ length: 9 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 85,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      duration: Math.random() * 7 + 5,
      delay: Math.random() * -12,
    }));
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#050507] px-4 text-white">

      {/* Galaxy background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Purple / blue nebula clusters */}
        <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-purple-700/[0.10] blur-[140px]" />
        <div className="absolute -right-40 top-[15%] h-[480px] w-[480px] rounded-full bg-blue-700/[0.08] blur-[150px]" />
        <div className="absolute -bottom-40 -right-20 h-[600px] w-[600px] rounded-full bg-purple-600/[0.12] blur-[160px]" />
        <div className="absolute -bottom-32 -left-40 h-[450px] w-[450px] rounded-full bg-blue-600/[0.07] blur-[150px]" />

        {/* Small stars */}
        {stars.map((star) => (
          <span
            key={star.id}
            className="galaxy-star absolute rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              opacity: star.opacity,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
              '--drift-x': `${star.driftX}px`,
              '--drift-y': `${star.driftY}px`,
            }}
          />
        ))}

        {/* Brighter colored stars */}
        {glowingStars.map((star) => (
          <span
            key={`glow-${star.id}`}
            className="glowing-star absolute rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <span
  key={`shoot-${star.id}`}
  className="shooting-star"
  style={{
    left: `${star.left}%`,
    top: `${star.top}%`,
    '--star-color': star.color,
    '--duration': `${star.duration}s`,
    '--delay': `${star.delay}s`,
  }}
>
  <span className="shooting-head" />
</span>
        ))}

        {/* Dark center vignette — keeps the text area clean */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,7,0.92)_0%,rgba(5,5,7,0.72)_32%,rgba(5,5,7,0.2)_68%,transparent_100%)]" />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">

        <div className="mb-14 font-mono text-2xl font-medium uppercase tracking-[0.45em] text-[#b993ff] sm:text-3xl">
          DEV<span className="text-[#8b5cf6]">LENS</span>
        </div>

        <h1 className="max-w-3xl text-5xl font-medium leading-[1.02] tracking-[-0.045em] text-[#f5f5f7] sm:text-6xl md:text-7xl">
          AI code review,
          <br />
          <span className="text-[#9b9ca5]">
            built into your PRs.
          </span>
        </h1>

        <p className="mt-9 max-w-xl text-base leading-7 text-[#a1a1aa] sm:text-lg">
          Catch bugs before they reach production.
          <br />
          Automated review for every pull request.
        </p>

        <button
          onClick={handleSignIn}
          className="group mt-12 inline-flex items-center gap-4 rounded-full border border-[#8b5cf6]/70 bg-[#08080b]/80 px-7 py-4 font-mono text-sm font-medium text-[#f4f4f5] backdrop-blur-sm transition-all duration-300 hover:border-[#a78bfa] hover:bg-[#111016] hover:shadow-[0_0_35px_rgba(139,92,246,0.18)]"
        >
          <GitHubMark />

          <span>Continue with GitHub</span>

          <span className="text-[#9ca3af] transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </button>

      </main>

      <style>{`
        .galaxy-star {
          box-shadow: 0 0 4px currentColor;
          animation:
            starDrift var(--duration) ease-in-out var(--delay) infinite alternate,
            starTwinkle 3s ease-in-out infinite alternate;
          will-change: transform, opacity;
        }

        .glowing-star {
          box-shadow:
            0 0 5px currentColor,
            0 0 14px currentColor,
            0 0 28px currentColor;
          animation:
            glowDrift var(--duration) ease-in-out var(--delay) infinite alternate,
            glowPulse 2.5s ease-in-out infinite alternate;
          will-change: transform, opacity;
        }

        .shooting-star {
  position: absolute;
  width: 100px;
  height: 2px;
  transform: rotate(-28deg);
  opacity: 0;
  animation: meteorAppear var(--duration) linear var(--delay) infinite;
  background: linear-gradient(
    90deg,
    transparent,
    var(--star-color),
    transparent
  );
}

.shooting-head {
  position: absolute;
  right: 0;
  top: 50%;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  transform: translateY(-50%);
  background: var(--star-color);
  box-shadow:
    0 0 5px var(--star-color),
    0 0 15px var(--star-color),
    0 0 30px var(--star-color);
}

        @keyframes starDrift {
          0% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(
              var(--drift-x),
              var(--drift-y),
              0
            );
          }

          100% {
            transform: translate3d(
              calc(var(--drift-x) * -0.5),
              calc(var(--drift-y) * -0.5),
              0
            );
          }
        }
          @keyframes meteorAppear {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(-28deg);
  }

  3% {
    opacity: 1;
  }

  15% {
    opacity: 0;
    transform: translate3d(260px, 160px, 0) rotate(-28deg);
  }

  100% {
    opacity: 0;
    transform: translate3d(260px, 160px, 0) rotate(-28deg);
  }
}

        @keyframes starTwinkle {
          0% {
            opacity: 0.2;
          }

          50% {
            opacity: 0.8;
          }

          100% {
            opacity: 0.35;
          }
        }

        @keyframes glowDrift {
          0% {
            transform: translate3d(-20px, 10px, 0) scale(0.8);
          }

          50% {
            transform: translate3d(25px, -20px, 0) scale(1.15);
          }

          100% {
            transform: translate3d(-10px, 25px, 0) scale(0.9);
          }
        }

        @keyframes glowPulse {
          0% {
            opacity: 0.35;
          }

          100% {
            opacity: 1;
          }
        }

        @keyframes shootingStar {
  0% {
    opacity: 0;
    transform: translate3d(0, 0, 0) rotate(-28deg) scaleX(0);
  }

  5% {
    opacity: 1;
    transform: translate3d(0, 0, 0) rotate(-28deg) scaleX(0.35);
  }

  18% {
    opacity: 0;
    transform: translate3d(180px, 110px, 0) rotate(-28deg) scaleX(1);
  }

  100% {
    opacity: 0;
    transform: translate3d(180px, 110px, 0) rotate(-28deg) scaleX(1);
  }
}

        @media (prefers-reduced-motion: reduce) {
          .galaxy-star,
          .glowing-star,
          .shooting-star {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function GitHubMark() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="18"
      height="18"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}
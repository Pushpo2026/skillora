import { useEffect, useState, useCallback } from 'react';

export function useHashRoute() {
  const [path, setPath] = useState(() => normalize(window.location.hash));

  useEffect(() => {
    const onChange = () => setPath(normalize(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to.startsWith('#') ? to : `#${to}`;
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, []);

  return { path, navigate };
}

function normalize(hash: string): string {
  if (!hash || hash === '#') return '/';
  return hash.startsWith('#') ? hash.slice(1) : hash;
}

export function Link({
  to,
  children,
  className,
  onClick,
}: {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <a
      href={`#${to}`}
      className={className}
      onClick={(e) => {
        e.preventDefault();
        window.location.hash = to;
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        onClick?.();
      }}
    >
      {children}
    </a>
  );
}

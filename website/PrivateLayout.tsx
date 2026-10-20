import type { ReactNode } from 'react';

// The login control stays unchanged. Its legacy public marketing chrome must not
// bring retired services/calendar links back into the public login experience.
export function Layout({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-merkad-bg-primary">
    <header className="p-6"><a className="text-white underline" href="/">MerkadAgency — return to website</a></header>
    <main>{children}</main>
  </div>;
}

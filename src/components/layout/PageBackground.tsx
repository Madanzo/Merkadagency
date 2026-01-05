export function PageBackground() {
  return (
    <>
      {/* Ambient Background */}
      <div className="page-background">
        <div className="ambient-orb ambient-orb--primary animate-pulse-glow" />
        <div className="ambient-orb ambient-orb--secondary" />
        <div className="ambient-orb ambient-orb--tertiary" />
        <div className="grid-overlay" />
      </div>
      
      {/* Noise Overlay */}
      <div className="noise-overlay" />
    </>
  );
}
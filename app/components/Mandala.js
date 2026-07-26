// Decorative mandala / chakra — pure SVG, no assets.
export default function Mandala({ className, spokes = 24 }) {
  const rays = Array.from({ length: spokes }, (_, i) => {
    const a = (i / spokes) * Math.PI * 2;
    return (
      <line
        key={i}
        x1={100} y1={100}
        x2={100 + Math.cos(a) * 96} y2={100 + Math.sin(a) * 96}
        stroke="currentColor" strokeWidth="2"
      />
    );
  });
  return (
    <svg className={className} viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="96" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="42" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="100" cy="100" r="14" fill="currentColor" />
      {rays}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return (
          <circle key={`p${i}`} cx={100 + Math.cos(a) * 70} cy={100 + Math.sin(a) * 70} r="6"
            fill="none" stroke="currentColor" strokeWidth="2" />
        );
      })}
    </svg>
  );
}

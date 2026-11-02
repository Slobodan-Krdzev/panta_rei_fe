export default function SectionKicker({ number, label, light = false }) {
  return (
    <div className={`section-kicker${light ? " light" : ""}`}>
      <span>{number}</span>
      <p>{label}</p>
    </div>
  );
}

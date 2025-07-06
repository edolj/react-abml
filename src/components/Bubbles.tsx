import { Argument } from "./ArgumentView";

interface BubblesProps {
  bubbles: Argument[];
  onRemove: (key: string) => void;
}

const Bubbles = ({ bubbles, onRemove }: BubblesProps) => {
  return (
    <div style={{ marginBottom: 10 }}>
      {bubbles.map((b) => (
        <div
          key={b.key}
          style={{
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "#607ad1",
            color: "white",
            padding: "4px 10px",
            borderRadius: 12,
            marginRight: 6,
            fontSize: 14,
            userSelect: "none",
          }}
        >
          <span>{b.operator ? `${b.key} ${b.operator}` : b.key}</span>
          <button
            onClick={() => onRemove(b.key)}
            style={{
              marginLeft: 8,
              background: "transparent",
              border: "none",
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
              fontSize: 16,
              lineHeight: 1,
            }}
            aria-label={`Remove ${b.key}`}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Bubbles;

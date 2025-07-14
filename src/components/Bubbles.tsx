import { Chip } from "@mui/material";
import { Argument } from "./ArgumentView";

interface BubblesProps {
  bubbles: Argument[];
  onRemove: (key: string) => void;
}

const Bubbles = ({ bubbles, onRemove }: BubblesProps) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {bubbles.map((b) => (
        <Chip
          key={b.key}
          label={b.displayName ?? b.key}
          onDelete={() => onRemove(b.key)}
          sx={{
            backgroundColor: "#607ad1",
            color: "white",
            "& .MuiChip-deleteIcon": {
              color: "white",
              fontWeight: "bold",
            },
          }}
        />
      ))}
    </div>
  );
};

export default Bubbles;

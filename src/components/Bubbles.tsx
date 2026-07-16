import { Chip } from "@mui/material";
import { Argument } from "./ArgumentView";

interface BubblesProps {
  bubbles: Argument[];
  onRemove: (key: string) => void;
  onBubbleClick: (
    event: React.MouseEvent<HTMLElement>,
    bubble: Argument
  ) => void;
}

const Bubbles = ({ bubbles, onRemove, onBubbleClick }: BubblesProps) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {bubbles.map((b) => (
        <Chip
          key={b.key}
          label={b.displayName ?? b.key}
          onDelete={() => onRemove(b.key)}
          onClick={(e) => onBubbleClick(e, b)}
          sx={{
            backgroundColor: "#607ad1",
            color: "white",
            cursor: "pointer",
            "&:hover": { backgroundColor: "#5069bf" },
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

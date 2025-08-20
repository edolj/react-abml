import { Button } from "react-bootstrap";

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const PrimaryButton = ({ children, onClick, style }: Props) => {
  return (
    <Button
      variant="primary"
      className="btn-primary custom-primary-button"
      onClick={onClick}
      style={style}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;

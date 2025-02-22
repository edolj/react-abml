interface Props {
  children: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const PrimaryButton = ({ children, onClick, style }: Props) => {
  return (
    <button
      type="button"
      className="btn btn-primary custom-primary-button"
      onClick={onClick}
      style={style}
    >
      {children}
    </button>
  );
};

export default PrimaryButton;

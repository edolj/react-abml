const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <div
      style={{
        backgroundColor: "green",
        color: "white",
        padding: "10px",
        textAlign: "center",
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      &copy; {currentYear} All rights reserved.
    </div>
  );
};

export default Footer;

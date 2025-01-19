import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

const NavBar = () => {
  return (
    <AppBar
      position="absolute"
      sx={{
        top: "10%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "90%",
        borderRadius: "12px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        backgroundColor: "#f0f6fc",
      }}
    >
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            fontWeight: "bold",
            color: "black",
          }}
        >
          ABML
        </Typography>
        <Button
          color="inherit"
          sx={{
            marginLeft: "auto",
            backgroundColor: "black",
            "&:hover": {
              backgroundColor: "#444444",
            },
            textTransform: "none",
          }}
        >
          About
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;

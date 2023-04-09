import { useState } from "react";
import "./LayoutHome.css";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography, // importar o componente Typography
  makeStyles, // importar o hook makeStyles
} from "@material-ui/core";
import { Menu, Close,Home, Lock, PersonAdd } from "@material-ui/icons";
import logo_servmais_app from "../assets/logo_servmais_app.png";
import {Link} from "react-router-dom";
const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    alignItems: "center", // centraliza os elementos verticalmente
  },
  logo: {
    height: 60,
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1, // remove o sublinhado do link
  },
  icon: {
    color: "white",
  },
  listItem: {
    color: "white",
    "&:hover": {
      backgroundColor: "#7fbf7f",
      color: "white",
  },
  }
}));

export const LayoutHome = (props) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const classes = useStyles(); // usar o hook makeStyles para definir as classes de estilo

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="static" style={{ background: 'rgba(0, 0, 0, 0.8)' }}>
        <Toolbar className={classes.header}>
          <IconButton edge="start" color="inherit" onClick={toggleDrawer}>
            <Menu />
          </IconButton>
          <div className={classes.logoContainer}>
            <img src={logo_servmais_app} alt="Service Mais" className={classes.logo} />
              <Typography variant="h6" className={classes.title}>
                Serv+
              </Typography>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer anchor="left" open={isDrawerOpen} onClose={toggleDrawer}>
        <div
          style={{
            width: 250,
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
            background: "linear-gradient(45deg, rgba(2,0,36,1) 0%, rgba(30,121,9,1) 50%, rgba(0,255,21,1) 95%)",
          }}
        >
          <List>
            <ListItem button onClick={handleDrawerClose} className={classes.listItem}>
              <ListItemIcon className={classes.icon}>
                <Close />
              </ListItemIcon>
              <ListItemText primary="Close" />
            </ListItem>
            <ListItem button component={Link} to = "/" className={classes.listItem}>
              <ListItemIcon className={classes.icon}>
                <Home />
              </ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={Link} to = "/login" className={classes.listItem}>
              <ListItemIcon className={classes.icon}>
                <Lock />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem button component={Link} to = "/register" className={classes.listItem}>
              <ListItemIcon className={classes.icon}>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      {props.children}
    </>
  );
};

export default LayoutHome;

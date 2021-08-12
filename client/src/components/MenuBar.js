import React, { useContext, useState } from 'react'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Hidden from '@material-ui/core/Hidden';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import { AuthContext } from '../context/auth';
import Bird from '../assets/bird.svg';
import './styles.scss';

function MenuBar() {
  
  const { user, logout } = useContext(AuthContext);

  const pathname = window.location.pathname;

  // based on whatever page you are in
  const path = pathname === '/' ? 'home' : pathname.substr(1); // substr(1) because you only want after '/' such as login in '/login'
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e) => setActiveItem(e.currentTarget.name);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuBar = user ?
  (
    // AppBar uses paper components inside
    <AppBar position="static" color="transparent"  elevation={3}>
      <Toolbar >
        <Button  
          className="Button-NoBG"
          href="/"
          style={{ marginRight: 'auto' }}
          disableRipple 
          disableFocusRipple 
          disableElevation 
          startIcon={<img src={Bird} alt="..." style={{ minWidth:'35px' }} />}
        >
          <Typography variant="h4"  >
            <span className="cursive" style={{textTransform: 'none'}}><b>FreeBirds</b></span>
          </Typography>
        </Button>

        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          { user.username } &nbsp;
          <img src='https://react.semantic-ui.com/images/avatar/large/molly.png' alt="..." style={{ width:'35px' }} />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ horizontal: "center" }}
        >
          <MenuItem onClick={handleClose} href={`/profile/${user.username}`} component="a">Profile</MenuItem>
          <MenuItem onClick={handleClose} href={`/settings`} component="a">Settings</MenuItem>
          <MenuItem onClick={() => {setConfirmOpen(true); handleClose();}}>Logout</MenuItem>
          {/* Confirmation prompt for logging out */}
          <Dialog
            open={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            aria-labelledby="draggable-dialog-title"
          >
            <DialogTitle>
              Confirm logout?
            </DialogTitle>
            <DialogContent>
              <DialogContentText variant="h6">
                Are you sure you want to logout?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button autoFocus onClick={() => setConfirmOpen(false)} color="primary">
                Cancel
              </Button>
              <Button onClick={logout} href={`/`} style={{ color: "red" }}>
                Logout
              </Button>
            </DialogActions>
          </Dialog>
        </Menu>
      </Toolbar>
    </AppBar>
  ) : 
  
  // LOGGED OUT
  (
    <AppBar position="static" color="transparent">
      <Toolbar >
        <Button  
          href="/"
          style={{ marginRight: 'auto' }}
          disableRipple 
          disableFocusRipple 
          disableElevation 
          startIcon={<img src={Bird} alt="..." style={{ minWidth:'35px' }} />}
        >
          <Typography variant="h4" >
            <span className="cursive" style={{textTransform: 'none'}}><b>FreeBirds</b></span>
          </Typography>
        </Button>
        <Hidden xsDown>
          <Button 
            href="/login"
            name="login" 
            onClick={handleItemClick} 
            variant="outlined" 
            color="inherit"
            style={{ 
              marginRight: '10px', 
              fontWeight: 'bold', 
              backgroundColor: `${activeItem === "login" ? '' : "#84d4fc"}`,
              borderColor: `${activeItem === "login" ? '' : "white"}`,
            }}
            disabled={ activeItem === "login" ? true : false}
          >
            Login
          </Button>
          <Button 
            href="/register" 
            name="register"
            onClick={handleItemClick}  
            variant="outlined" 
            color="inherit" 
            style={{ 
              fontWeight: 'bold', 
              backgroundColor: `${activeItem === "register" ? '' : "#84d4fc"}`,
              borderColor: `${activeItem === "register" ? '' : "white"}`,
            }}
            disabled={ activeItem === "register" ? true : false}
          >
            Register
          </Button>
        </Hidden>

        {/* Only for MOBILE */}
        <Hidden smUp>
          {
            path === "login" ?
            <Button 
              href="/register" 
              name="register"
              onClick={handleItemClick}  
              variant="outlined" 
              color="inherit" 
              style={{ 
                fontWeight: 'bold', 
                backgroundColor: `${activeItem === "register" ? '' : "#84d4fc"}`,
                borderColor: `${activeItem === "register" ? '' : "white"}`,
              }}
              disabled={ activeItem === "register" ? true : false}
            >
              Register
            </Button>
            :
            <Button 
              href="/login"
              name="login" 
              onClick={handleItemClick} 
              variant="outlined" 
              color="inherit"
              style={{ 
                marginRight: '10px', 
                fontWeight: 'bold', 
                backgroundColor: `${activeItem === "login" ? '' : "#84d4fc"}`,
                borderColor: `${activeItem === "login" ? '' : "white"}`,
              }}
              disabled={ activeItem === "login" ? true : false}
            >
              Login
            </Button>
          }
        </Hidden>
      </Toolbar>
    </AppBar>
  )

  return menuBar;
}

export default MenuBar
import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import getUser from '../util/getUser';
import User from '../interface/User'
import { Link } from "react-router-dom";
import MessagesBar from './MessagesBar';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(1),
      width: 'auto',
    },
  }));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('sm')]: {
        width: '12ch',
        '&:focus': {
          width: '20ch',
        },
      },
    },
  }));

export default function PrimarySearchAppBar() {
  const user: User|null = getUser();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const[anchorMessages, setAnchorMessages] = React.useState<null | HTMLElement>(null);

  const[anchorNotifications, setAnchorNotifications] = React.useState<null | HTMLElement>(null);

  const isNotificationsOpen = Boolean(anchorNotifications);

  const isMessagesOpen = Boolean(anchorMessages);

  const isAccountOpen = Boolean(anchorEl);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => {
    setAnchor(event.currentTarget);
  };


  const handleMenuClose = (setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>) => {
    setAnchor(null);
  };


  const accountMenuId = 'primary-account-menu';
  const renderAccountMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={accountMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isAccountOpen}
      onClose={()=>{handleMenuClose(setAnchorEl)}}
    >
      <MenuItem >Profile</MenuItem>
      <MenuItem >Log Out</MenuItem>
    </Menu>
  );

  const MessagesId = 'primary-messages-menu';
  const renderMessages = (
    <Menu
      anchorEl={anchorMessages}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={MessagesId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMessagesOpen}
      onClose={()=>{handleMenuClose(setAnchorMessages)}}
    >
      <MenuItem ><MessagesBar/></MenuItem>
    </Menu>
  );

  const NotificationsId = 'primary-notifications-menu';
  const renderNotifications = (
    <Menu
      anchorEl={anchorNotifications}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={NotificationsId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isNotificationsOpen}
      onClose={()=>{handleMenuClose(setAnchorNotifications)}}
    >
      <MenuItem >Profile</MenuItem>
      <MenuItem >Log Out</MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        
           <Link to="/aboutUs" style={{ textDecoration: 'none', color: 'white'}}>  
           <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, mr:7}}
          >Projekt</Typography>
          </Link>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <IconButton
              size="large"
              edge="end"
              sx={{mr:0.5}}
              aria-label="show 17 new emails"
              aria-controls={NotificationsId}
              aria-haspopup="true"
              onClick={(e)=>{handleMenuOpen(e, setAnchorMessages)}}
              color="inherit"
            >
             <Badge badgeContent={17} color="error">
                <MailIcon />
              </Badge>
            </IconButton>

            <IconButton
              size="large"
              edge="end"
              sx={{mr:0.5}}
              aria-label="show 17 new notifications"
              aria-controls={NotificationsId}
              aria-haspopup="true"
              onClick={(e)=>{handleMenuOpen(e, setAnchorNotifications)}}
              color="inherit"
            >
              <Badge badgeContent={17} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={accountMenuId}
              aria-haspopup="true"
              onClick={(e)=>{handleMenuOpen(e, setAnchorEl)}}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {renderMessages}
      {renderNotifications}
      {renderAccountMenu}
    </Box>
  );
}

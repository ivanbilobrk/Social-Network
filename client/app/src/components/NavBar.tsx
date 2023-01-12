import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';
import getUser from '../util/getUser';

import User from '../interface/User';
import handleLogout from '../util/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import TextField from '@mui/material/TextField';
import { createFilterOptions } from '@mui/material/Autocomplete';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Avatar from '@mui/material/Avatar';
import {
  createTheme,
  Divider,
  inputLabelClasses,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ThemeProvider,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationComponent from './NotificationComponent';

const theme = createTheme({
  components: {
    // Inputs
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#eee',
          '& .MuiOutlinedInput-notchedOutline': {
            border: 'none',
          },
          '&.Mui-focused': {
            '& .MuiOutlinedInput-notchedOutline': {
              border: 'none',
            },
          },
        },
      },
    },
  },
});

type UserT = {
  firstName: string;
  lastName: string;
  userName: string;
  avatar_url: string;
  key: number;
};

const users: UserT[] = [];

const getIdByUsername = (userName: string) => {
  return users.filter((user) => user.userName == userName)[0];
};

const extractUserNameFromOption = (option: string) => {
  return option.split(' ')[1];
};

const getAvatar = (option:string) =>{
  return option.split(' ')[0];
}

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export default function PrimarySearchAppBar(props: any) {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const [inputValue, setInputValue] = React.useState('');
  let [open, setOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getData = async () => {
      try {
        const user = getUser();

        if (user !== null) {
          const response = await axiosPrivate.get(`/users`, {});
          response.data.forEach((el: any, index: any) => {
            if(el.id !== user.id){
              users[index] = {
                userName: el.username,
                key: parseInt(el.id),
                avatar_url: el.avatar_url,
                firstName: el.first_name,
                lastName: el.last_name,
              };
            }
          });
          setLoading(false);
        }
      } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getData();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const changeSearchOpen = (input:string) =>{
    if(input.length < 2){
      setOpen(false);
    } else {
      setOpen(true);
    }
  }

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const [anchorNotifications, setAnchorNotifications] = React.useState<null | HTMLElement>(null);

  const isNotificationsOpen = Boolean(anchorNotifications);

  const isAccountOpen = Boolean(anchorEl);

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
  ) => {
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
      onClose={() => {
        handleMenuClose(setAnchorEl);
      }}
    >
      <MenuItem onClick={()=>{navigate('/home')}}> <HomeIcon sx={{mr:2}}/> Home</MenuItem>
      <MenuItem onClick={()=>{navigate('/myprofile')}}> <AccountCircleIcon sx={{mr:2}}/> My Profile</MenuItem>
      <MenuItem onClick={()=>{navigate('/edit')}}> <EditIcon sx={{mr:2}}/>  Edit Profile</MenuItem>
      <MenuItem onClick={()=>{navigate('/inbox')}}><MessageIcon sx={{mr:2}}/>Inbox</MenuItem>
      <MenuItem onClick={()=>{handleLogout(); navigate('/login', {replace: true});}}>
          <ListItemIcon sx={{mr:0.6}}>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
    </Menu>
  );

  const OPTIONS_LIMIT = 10;
  const defaultFilterOptions = createFilterOptions();

  const filterOptions = (options:any, state:any) => {
      return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
    };

    if(!isLoading){
      return (
        <Box sx={{ flexGrow: 1, zIndex:10}}>

      <AppBar position="relative" sx={{zIndex:5}}>
        <Toolbar sx={{zIndex:10}}>
          <Link to="/home" style={{ textDecoration: 'none', color: 'white', zIndex:5 }}>
            <HomeIcon sx={{zIndex:5}}/>
          </Link>
        
          
           <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ display: { xs: 'none', sm: 'block' }, ml:2, zIndex:5}} >Projekt</Typography>
          
          
                 <Autocomplete sx={{ width: '18%', mt:1, mb: 1, padding:0, zIndex:5 }}
                 open = {open} onBlur={()=>setOpen(false)} 
                 filterOptions={filterOptions}
                         onInputChange={(event, newInputValue) => {
                          setInputValue(newInputValue);
                          changeSearchOpen(inputValue);
                        }}
                    id="free-solo-demo"
                    freeSolo
                    clearOnBlur
                    options={users.map((option) => {return option.avatar_url+" "+ option.userName+" "+option.firstName+" "+option.lastName})}
                    
                    renderOption ={(option:any)=>{ return (
                                      <>
                                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper',}}>
                                          <Link to = {`/users/:${getIdByUsername(extractUserNameFromOption(option.key)).key}`} style={{color: 'inherit', textDecoration: 'inherit'}} key={`${option.key}5`}>
                                            <ListItem key={`${option.key}`}>
                                              <ListItemAvatar key={`${option.key}1`}>
                                                <Avatar alt={getAvatar(option.key)} src={getAvatar(option.key)} key={`${option.key}2`}/>
                                              </ListItemAvatar>
                                            <ListItemText primary={extractUserNameFromOption(option.key)} key={`${option.key}3`}/> </ListItem>
                                          </Link>
                                          <Divider variant="inset" component="li" key={`${option.key}4`}/>
                                        </List>
                                      </>
                      )}}
                    renderInput={(params) => 
                    <>
                      <SearchIconWrapper sx={{mr:5, zIndex:5}}>
                        <SearchIcon sx={{mb:'50%', zIndex:5}}/>
                      </SearchIconWrapper>
                      <ThemeProvider theme={theme}>
                        <TextField   {...params} label="Search users" sx={{ ml: 6 }} InputLabelProps={{
                                                                                    sx: {color: "grey", [`&.${inputLabelClasses.shrink}`]: {color: "grey", fontSize:0}}}}/>
                      </ThemeProvider>
                    </>}/>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
           <NotificationComponent />
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
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



            <Box sx={{ flexGrow: 1 }} />

            </Box>
          </Toolbar>
          
          
        </AppBar>
        {renderAccountMenu}
      </Box>
    );
  } else {
    return <div>Loading...</div>;
  }
}

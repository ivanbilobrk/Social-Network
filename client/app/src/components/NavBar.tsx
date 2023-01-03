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
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MessageIcon from '@mui/icons-material/Message';
import getUser from '../util/getUser';
import User from '../interface/User';
import { Link } from 'react-router-dom';
import handleLogout from '../util/Logout';
import ListItemIcon from '@mui/material/ListItemIcon';
import Logout from '@mui/icons-material/Logout';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { useNavigate, Link as ReactLink, useLocation } from 'react-router-dom';
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
import useAxiosPrivate from '../hooks/useAxiosPrivate';

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
  key: number;
};

const users: UserT[] = [];

const getIdByUsername = (userName: string) => {
  return users.filter((user) => user.userName == userName)[0];
};

const extractUserNameFromOption = (option: string) => {
  return option.split(' ')[0];
};

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

export default function PrimarySearchAppBar(props: any) {
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getData = async () => {
      try {
        const user = getUser();

        if (user !== null) {
          const response = await axiosPrivate.get(`/users`, {});
          response.data.forEach((el: any, index: any) => {
            users[index] = {
              userName: el.username,
              key: parseInt(el.id),
              firstName: el.first_name,
              lastName: el.last_name,
            };
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
      <MenuItem
        onClick={() => {
          navigate('/edit', { replace: true });
        }}
      >
        Edit Profile
      </MenuItem>
      <MenuItem>
        Inbox <MessageIcon sx={{ ml: 2 }} />
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate('/myprofile', { replace: true });
        }}
      >
        My Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleLogout();
          navigate('/login', { replace: true });
        }}
      >
        <ListItemIcon>
          <Logout fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
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
      onClose={() => {
        handleMenuClose(setAnchorNotifications);
      }}
    ></Menu>
  );

  if (!isLoading) {
    return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="open drawer" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>

            <Link to="/home" style={{ textDecoration: 'none', color: 'white', width: 70 }}>
              <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
                Projekt
              </Typography>
            </Link>

            <Autocomplete
              sx={{ width: '18%', mt: 1, mb: 1, padding: 0 }}
              id="free-solo-demo"
              freeSolo
              options={users.map((option) => {
                return option.userName + ' ' + option.firstName + ' ' + option.lastName;
              })}
              renderOption={(option: any) => {
                return (
                  <>
                    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                      <Link
                        to={`/users/:${getIdByUsername(extractUserNameFromOption(option.key)).key}`}
                        style={{ color: 'inherit', textDecoration: 'inherit' }}
                      >
                        <ListItem key={`${option.key}`}>
                          <ListItemAvatar>
                            <Avatar alt={`${option.key}`} src="https://source.unsplash.com/random" />
                          </ListItemAvatar>
                          <ListItemText primary={extractUserNameFromOption(option.key)} />{' '}
                        </ListItem>
                      </Link>
                      <Divider variant="inset" component="li" />
                    </List>
                  </>
                );
              }}
              renderInput={(params) => (
                <>
                  <SearchIconWrapper sx={{ mr: 5 }}>
                    <SearchIcon sx={{ mb: '50%' }} />
                  </SearchIconWrapper>
                  <ThemeProvider theme={theme}>
                    <TextField
                      {...params}
                      label="Search users"
                      sx={{ ml: 6 }}
                      InputLabelProps={{
                        sx: { color: 'grey', [`&.${inputLabelClasses.shrink}`]: { color: 'grey', fontSize: 25 } },
                      }}
                    />
                  </ThemeProvider>
                </>
              )}
            />
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls={accountMenuId}
                aria-haspopup="true"
                onClick={(e) => {
                  handleMenuOpen(e, setAnchorEl);
                }}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
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

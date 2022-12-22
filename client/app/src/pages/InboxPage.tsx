import getUser from '../util/getUser';
import NavBar from '../components/NavBar'
import { Autocomplete, Avatar, createTheme, Divider, inputLabelClasses, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, styled, TextField, ThemeProvider } from '@mui/material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import InboxDrawer from '../components/InboxDrawer';
import zIndex from '@mui/material/styles/zIndex';
import SelectInput from '@mui/material/Select/SelectInput';

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));

const theme = createTheme({
    components: {
      // Inputs
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            backgroundColor: "#eee",
            "& .MuiOutlinedInput-notchedOutline": {
              border: "none"
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none"
              }
            }
          }
        }
      }
    }
  });

  type UserT = {
    firstName: string;
    lastName: string;
    userName: string;
    key: number
  };

  const users: UserT[] = [];

const getFirstLastnameForId = (option:string) =>{
    const id = parseInt(option);
    const tempUser =  users.filter(user=>user.key == id)[0];
    return tempUser.firstName+" "+tempUser.lastName;
}

//@ts-ignore
const Search = (user, updateInbox, inputRef, setFlagInboxOpen, flagInboxOpen)=>{
    let [label, setLabel] = useState("Message users");
    let [open, setOpen] = useState(false);
    return (
        <Autocomplete sx={{ width: '80%', mt:1, mb: 1, padding:0 }} 
        id="free-solo-demo" freeSolo clearOnBlur clearOnEscape open = {open} onFocus={()=>{setOpen(true)}} 
        options={users.map((option) => {return option.key+""})}
        renderOption ={(option:any)=>{ return (
            <>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper',}}> 
                
                <ListItemButton onClick={()=>{setOpen(false); setLabel("Message users");updateInbox(getFirstLastnameForId(option.key), parseInt(option.key)); inputRef.current.focus();}}>            
                    <ListItem key={`${option.key}`}>
                        <ListItemAvatar>
                            <Avatar alt={`${option.key}`} src="https://source.unsplash.com/random"/>
                        </ListItemAvatar>
                        <ListItemText primary={getFirstLastnameForId(option.key)}/> 
                        </ListItem> 
                        </ListItemButton>    
                        <Divider variant="inset" component="li" />
                </List>
            </>
        )}}
        renderInput={(params) => 
            <>
                    <SearchIconWrapper sx={{mr:5}}>
                        <SearchIcon sx={{mb:'100%'}}/>
                    </SearchIconWrapper>
                <ThemeProvider theme={theme}>
                    <TextField   {...params} label={label} sx={{ ml: 6 }} InputLabelProps={{
                                                                          sx: {color: "grey", [`&.${inputLabelClasses.shrink}`]: {color: "grey", fontSize:25}}}}/>
                </ThemeProvider>
            </>
        }/>
    );
}


const InboxPage = ()=>{
    const [isLoading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();   

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();
      
        const getData = async () => {
            try {
                const user = getUser();
                
                if(user !== null){
                    const response = await axiosPrivate.get(`/users`, {
                    });
                    response.data.forEach((el:any, index:any)=>{users[index] = {userName: el.username, key:parseInt(el.id), firstName: el.first_name, lastName: el.last_name}})
                    setLoading(false);
                }
            } catch (err) {                                         
                console.error(err);
                navigate('/login', { state: { from: location }, replace: true });
            }
        }
    
        getData();
        return () => {
            isMounted = false;
            controller.abort();
        }
    }, [])


    if(!isLoading){
        return (
            <>
                <div>
                    <InboxDrawer search={Search}/>
                </div>
                
            </>);
      } else {
        return(<div>
          Loading...
          </div>);
      }
}

export default InboxPage;
import getUser from '../util/getUser';
import NavBar from '../components/NavBar'
import { Autocomplete, Avatar, createTheme, Divider, inputLabelClasses, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, styled, TextField, ThemeProvider, createFilterOptions } from '@mui/material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import InboxDrawer from '../components/InboxDrawer';
import React from 'react';

const SearchIconWrapper = styled('div')(({ theme }: any) => ({
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
    avatar_url: string;
    key: number
  };

  const users: UserT[] = [];

const getFirstLastnameForId = (option:string) =>{
   
    return option.split(' ')[3] + " " +option.split(' ')[4];
}

const getUserId= (option:string) =>{

    return option.split(' ')[1];
}

const getAvatar = (option:string) =>{
    console.log(option)
    return option.split(' ')[0];
}


//@ts-ignore
const Search = (user, updateInbox, inputRef, setFlagInboxOpen, flagInboxOpen)=>{
    let [label, setLabel] = useState("Message users");
    let [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = React.useState('');
    const changeSearchOpen = (input:string) =>{
        if(input.length < 2){
          setOpen(false);
        } else {
          setOpen(true);
        }
    }
    const OPTIONS_LIMIT = 10;
    const defaultFilterOptions = createFilterOptions();

    const filterOptions = (options:any, state:any) => {
        return defaultFilterOptions(options, state).slice(0, OPTIONS_LIMIT);
      };

    return (
        <Autocomplete sx={{ width: '80%', mt:1, mb: 1, padding:0 }} 
        filterOptions={filterOptions}
        onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            changeSearchOpen(inputValue);
          }}
        id="free-solo-demo" freeSolo clearOnBlur clearOnEscape open = {open} onBlur={()=>setOpen(false)} 
        options={users.map((option) => {return option.avatar_url+" "+ option.key+" "+ option.userName+" "+option.firstName+" "+option.lastName})}
        renderOption ={(option:any)=>{ return (
            <>
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper',}}> 
                
                <ListItemButton onClick={()=>{setOpen(false); setLabel("Message users");updateInbox(getFirstLastnameForId(option.key), parseInt(getUserId(option.key))); inputRef.current.focus();}}>            
                    <ListItem key={`${option.key}`}>
                        <ListItemAvatar>
                            <Avatar alt={getAvatar(option.key)} src={getAvatar(option.key)}/>
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
                                                                          sx: {color: "grey", [`&.${inputLabelClasses.shrink}`]: {color: "grey", fontSize:0}}}}/>
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
                    response.data.forEach((el:any, index:any)=>{  if(el.id != user.id) { users[index] = {userName: el.username, key:parseInt(el.id), firstName: el.first_name, lastName: el.last_name, avatar_url: el.avatar_url}}})
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
                <NavBar/>
                <div >
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
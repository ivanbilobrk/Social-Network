import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { Avatar, ListItemAvatar, styled, TextField, Container } from '@mui/material';
import { useEffect, useState, useRef} from 'react';
import MessageOne from '../interface/MessageOne';
import SendIcon from '@mui/icons-material/Send';
import getUser from '../util/getUser';
import User from '../interface/User';
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useLocation, useNavigate } from 'react-router-dom';

const StyledSendIcon = styled(SendIcon, {
  name: "StyledSendIcon",
  slot: "Wrapper"
})({
  color: "grey",
  "&:hover": { color: "blue" }
});



const drawerWidth = 400;

let inbox:MessageOne[] = [];
//@ts-ignore
export default function InboxDrawer({search}) {

  const axiosPrivate = useAxiosPrivate();

  let [flagInboxOpen, setFlagInboxOpen] = useState(false);

  let [input, setInput] = useState("");
  let [selectedUser, setSelectedUser] = useState("");
  const [inboxId, setInboxId] = useState<number>();

  let [user, setUser] = useState<User|null>();
  const [lastMessages, setLastMessages] = useState([]);
  const [inbox, setInbox] = useState([]);
  let inputRef = useRef();
  const [users, setUsers] = useState<any []>([])

  const getMessagesForUser = async(currentUser:any)=>{
    let response = await axiosPrivate.get('/messages',{});
    response.data.forEach((el:any)=>{
      //@ts-ignore
      setLastMessages(old=>{
        if(el.sender.username == currentUser){
          return [...old, {firstLastName:el.receiver.first_name+" "+el.receiver.last_name,
        message: el.lastMessage.content, id:el.receiver.id, username:el.receiver.username, avatar_url: el.receiver.avatar_url}]
        } else{
          return [...old, {firstLastName:el.sender.first_name+" "+el.sender.last_name,
          message: el.lastMessage.content, id:el.sender.id, username:el.sender.username, avatar_url: el.sender.avatar_url}]
        }
      })

    })
  }

  const getInbox = async(from:number)=>{
    let response = await axiosPrivate.get(`/users/messages/${from}`,{});
    setInbox(response.data)
  }

  const updateInbox = async (from:any, id:any)=>{

    setFlagInboxOpen(true);
    setSelectedUser(from);
    setInboxId(id)
    await getInbox(id);
    //@ts-ignore
    inputRef.current.focus()

  }

  const addToList = async (event:any) => {
    if(event != null && event != undefined && (event.keyCode == 13 || event =="icon")){
      await axiosPrivate.post('/messages', 
              JSON.stringify({
              content: input,  
              receiverId: inboxId}), 
            {
            headers: {'Content-Type':'application/json'},
            withCredentials: true
            });

      await updateInbox(selectedUser, inboxId);
      setLastMessages([]);
      await getMessagesForUser(user?.username)
      setInput("");
    }

  };

  const getPicForUsername = (username:string) =>{
    let url : string = ""
    users.forEach(user => {
      if (user.username == username){
        url = user.avatar_url
      }
    })
    return url;
}

const getPicForFistLastName = (firstlastName: string) => {
  let url: string = " "
  users.forEach(user => {
    if(user.first_name+" "+user.last_name == firstlastName){
      url = user.avatar_url
    }
  })
  return url;
}


const listMessage = (id: number)=>{
  let username = users.filter(user => user.id == id)[0].username
  return (
      <ListItemAvatar>
        <Avatar src={getPicForUsername(username)}/>
      </ListItemAvatar>
)}

  const divRef = useRef(null);

  useEffect(() => {
    //@ts-ignore
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  });


  useEffect(()=>{
      setUser(getUser());
      getMessagesForUser(getUser()?.username);
  }, [])

  useEffect(() => {
     const getData = async () => {
      try {
        const user = getUser();

        if (user != null) {
          const response = await axiosPrivate.get('/users')
          setUsers(response.data);
        }
      } catch (err: any) {
        console.log(err.toJSON());
      }
    };

    getData();
  }, [])


  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{
          zIndex:1,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
        
          
        <List>
            <ListItem>
                {
                search(user?.username, updateInbox, inputRef, setSelectedUser, setFlagInboxOpen, flagInboxOpen)}
            </ListItem>
        </List>
        
          <List sx={{width:'100%'}}>
            {
            //@ts-ignore
            lastMessages.map((el:any, index) => (
              
              <ListItem alignItems="flex-start" sx={{width:'100%'}} onClick={async ()=>{await updateInbox(el.firstLastName, el.id)}}>
                <ListItemButton>
              <ListItemAvatar>
                <Avatar alt={el.firstLastName} src={el.avatar_url}></Avatar>
              </ListItemAvatar>
              <ListItemText primary={el.firstLastName} secondary={
              
                  <React.Fragment>
                    {el.message}
                    <Divider/>
                  </React.Fragment>
              }/>
      </ListItemButton>
      </ListItem>))}
          </List>
          
        </Box>
      </Drawer>
      {selectedUser.length >  0 && 
          <Container  sx={{position:'fixed',right:'0em',height:'10%',width:'1000', bgcolor:'#F8F6F0', zIndex:0, display:'flex', justifyContent:'center', alignItems:'center', ml:'50%'}}>
            <Avatar src={getPicForFistLastName(selectedUser)} sx={{ width: '6%', height: '90%' }} />
            <div style={{marginLeft:50, display:'flex', alignItems:'center'}}>
              <Typography variant ='h5'>{selectedUser}</Typography>
            </div>  
          </Container>
        }
      <Box component="main" sx={{ flexGrow: 1, p: 5, mr:2, ml:5, mb:5, mt:3, display:'flex', justifyContent:'flex-end', flexDirection:'column'}}>
      <List  sx={{zIndex:-1, mt:5, display:'flex',flexDirection:'column'}} >
        
        {inbox?.length > 0 && inbox.map((item:any, index) => 
          //@ts-ignore
          item.senderId == user.id ? 
          <ListItem style={{ display:'flex',justifyContent:'flex-end'}}>
            <div style={{ marginRight:'2.5%'}}>
              <Typography flexWrap={'wrap-reverse'}>
                {item.content}
              </Typography>
              
            </div>
    
            {listMessage(item.senderId)}
          </ListItem>:
          <ListItem style={{display:'flex', width:'50%', transform: 'translateX(24em)',justifyContent:'flex-start'}}>
            {listMessage(item.senderId)}

            <ListItemText>
                {item.content}
              </ListItemText>
          </ListItem>

          )}
      </List>
      <div ref={divRef}></div>
      {flagInboxOpen && 
      <>
        <TextField inputRef={inputRef} sx={{zIndex:100, position:'fixed', bottom:'1em', right:'8em', width:'60%' }} onChange={(e: { target: { value: React.SetStateAction<string>; }; })=>{setInput(e.target.value);}} onKeyDown={addToList} value={input} placeholder='Write a message...'></TextField>
        <StyledSendIcon onClick={async()=>{await addToList("icon")}} sx={{position:'fixed', bottom:'0.6em', right:'1.9em', fontSize:'2.5em'}}/>
      </>
      }
      </Box>
    </Box>
  );
}
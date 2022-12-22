import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import NavBar from './NavBar';
import Messages from './Messages';
import { Avatar, ListItemAvatar, styled, TextField, Container } from '@mui/material';
import { useEffect, useState, useRef, createRef } from 'react';
import MessageOne from '../interface/MessageOne';
import SendIcon from '@mui/icons-material/Send';
import getUser from '../util/getUser';
import User from '../interface/User';

const messagesTemp:MessageOne[] = [{from:"user2", to:"user1", allMesagesWithUser:["poruka1aaaaaaaaaaaaaaa", "poruka2", "poruka3","poruka1", "poruka2", "poruka3","poruka1", "poruka2", "poruka3","poruka1", "poruka2", "poruka3","poruka1", "poruka2", "poruka3", "nke"]}, 
{from:"user3", to:"user1", allMesagesWithUser:["poruka4", "poruka5", "poruka6"]},
 {from:"user4", to:"user1", allMesagesWithUser:["poruka1", "poruka2", "poruka3"]},
{from:"user5", to:"user1", allMesagesWithUser:["poruka1", "poruka2", "poruka3"]}, 
{from:"user6", to:"user1", allMesagesWithUser:["poruka1", "poruka2", "poruka3"]},
 {from:"user7", to:"user1", allMesagesWithUser:["poruka1", "poruka2", "poruka3"]}]


 const listMessage = ()=>{
  return (
      <ListItemAvatar>
        <Avatar src="https://source.unsplash.com/random"/>
      </ListItemAvatar>
)}

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
  let [flagInboxOpen, setFlagInboxOpen] = useState(false);
  let [messages, setMessages] = useState<MessageOne[]>([]);
  let [input, setInput] = useState("");
  let [selectedUser, setSelectedUser] = useState("");
  let [currentMessages, setCurrentMessages] = useState<string[]>([]);
  let [user, setUser] = useState<User|null>();
  let inputRef = useRef();

  const updateInbox = (to:string, from:string)=>{

    setFlagInboxOpen(true);
    setSelectedUser(from);

    //@ts-ignore
    inputRef.current.focus()
    setCurrentMessages((messages.filter(el=>el.from == from))[0]?.allMesagesWithUser);
    console.log(currentMessages.length)
    
    if(((messages.filter(el=>el.from == from))[0]?.allMesagesWithUser) == undefined){
      setMessages((old)=>[{from: from, to: to, allMesagesWithUser: []}, ...old])
      setCurrentMessages((messages.filter(el=>el.from == from))[0]?.allMesagesWithUser);
      console.log(messages)
    }
  }

  const addToList = (event:any) => {
    if(event != null && event != undefined && (event.keyCode == 13 || event =="icon")){

      let tempArr =  currentMessages;
      tempArr.push(input);
  
      setCurrentMessages(tempArr);
  
      setInput("");
    }

  };

  const divRef = useRef(null);

  useEffect(() => {
    //@ts-ignore
    divRef.current.scrollIntoView({ behavior: 'smooth' });
  });


  useEffect(()=>{
      setUser(getUser());
      let getMessagesForUser = async ()=>{
        setUser(getUser());
        console.log(getUser()?.id)
        messagesTemp.forEach((el, index)=>{setMessages(old=>[...old, el])});
      };

      getMessagesForUser();
  }, [])

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Drawer
        variant="permanent"
        sx={{

          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
        <List>
            <ListItem>
                {
                search(user?.username, updateInbox, inputRef)}
            </ListItem>
        </List>
        
          <List sx={{width:'100%'}}>
            {messages.filter(el=>el.allMesagesWithUser.length > 0).map((el:MessageOne, index) => (
              
              <ListItem alignItems="flex-start" sx={{width:'100%'}} onClick={()=>{updateInbox(el.to, el.from)}}>
                <ListItemButton>
              <ListItemAvatar>
                <Avatar alt="Remy Sharp" src="https://source.unsplash.com/random" />
              </ListItemAvatar>
              <ListItemText primary={el.from} secondary={
              
                  <React.Fragment>
                    {el.allMesagesWithUser[el.allMesagesWithUser.length-1]}
                    <Divider/>
                  </React.Fragment>
              }/>
      </ListItemButton>
      </ListItem>))}
          </List>
          
        </Box>
      </Drawer>
      {selectedUser.length >  0 && 
          <Container maxWidth={false} sx={{position:'fixed',right:'0em',height:'10%',width:'80%', bgcolor:'lightBlue', zIndex:2, display:'flex', justifyContent:'center', alignItems:'center'}}>
            <Avatar src="https://source.unsplash.com/random" sx={{ width: '6%', height: '90%' }} />
            <div style={{marginLeft:50, display:'flex', alignItems:'center'}}>
              <Typography variant ='h5'>{selectedUser}</Typography>
            </div>  
          </Container>
        }
      <Box component="main" sx={{ flexGrow: 1, p: 5, mr:2, ml:5, mb:5, mt:3, display:'flex', justifyContent:'flex-end', flexDirection:'column'}}>
      <List  sx={{mt:5, display:'flex',flexDirection:'column'}} >
        
        {currentMessages?.length > 0 && currentMessages.map((item, index) => 
          index % 2 == 0 ? 
          <ListItem style={{display:'flex',justifyContent:'flex-end'}}>
            <div style={{marginRight:'2.5%'}}>
              <Typography flexWrap={'wrap-reverse'}>
                {item}
              </Typography>
              
            </div>
    
            {listMessage()}
          </ListItem>:
          <ListItem style={{display:'flex', width:'50%', transform: 'translateX(24em)',justifyContent:'flex-start'}}>
            {listMessage()}

            <ListItemText>
                {item}
              </ListItemText>
          </ListItem>

          )}
      </List>
      <div ref={divRef}></div>
      {flagInboxOpen && 
      <>
        <TextField inputRef={inputRef} sx={{position:'fixed', bottom:'1em', right:'8em', width:'60%' }} onChange={(e: { target: { value: React.SetStateAction<string>; }; })=>{setInput(e.target.value); console.log(input)}} onKeyDown={addToList} value={input} placeholder='Write a message...'></TextField>
        <StyledSendIcon onClick={()=>{addToList("icon")}} sx={{position:'fixed', bottom:'0.6em', right:'1.9em', fontSize:'2.5em'}}/>
      </>
      }
      </Box>
    </Box>
  );
}
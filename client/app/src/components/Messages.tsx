import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import MessageOne from "../interface/MessageOne";
import { useEffect, useState } from "react";

//@ts-ignore
const Messages = (props)=>{
  let [messages, setMessages] = useState<string[]>([]);
  useEffect(()=>{
    const{content} = props;
    content[0].allMesagesWithUser.forEach((el:string, index:number)=>{setMessages(old=>[...old, el])})
  },[])


  return (
  <List> 
  {messages.map((text:any, index:number) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
  );
}

export default Messages;
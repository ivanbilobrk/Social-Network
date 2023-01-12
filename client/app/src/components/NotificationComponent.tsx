import { DialogContent, DialogContentText, IconButton, List, ListItem, Badge, ListItemAvatar, ListItemText, responsiveFontSizes } from '@mui/material'
import React, { Component, useEffect, useState } from 'react'
import NotificationsIcon from '@mui/icons-material/Notifications';
import {DialogTitle, Dialog, DialogProps} from '@mui/material';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import User from '../interface/User';
import getUser from '../util/getUser';




const NotificationComponent = () => {

   const [open, setOpen] = useState(false)
   const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
   const [messages, setMessages] = useState<any>([])
   const [user, setUser] = useState<User|null>()
   const [count, setCount] = useState<any>({})

   const axiosPrivate = useAxiosPrivate()

   const handleDialogOpen = (scrollType: DialogProps['scroll']) => {
      setOpen(true)
      setScroll(scrollType)

      if(messages != null){
      
      messages.forEach((el: any) => {
         console.log(el)
         try{
         axiosPrivate.post(
            '/messages/markAsRead/'+el.senderId
         ).then(function (response){
            console.log("USPJEH za: ", el.id)
         })
      }catch (error: any){
         console.log("NESUPJEŠAN MARK AS READ ZAHTJEV")
      }
      })
      
    }

   }

  //postavljenja usera
  useEffect(() => {
   setUser(getUser())
  }, [])

  //dohvaćanje readCounta s backenda
  useEffect(() => {
   
   try{
      axiosPrivate.get(
         '/messages/unreadCount'
      ).then(function (response){
         setCount(response.data)
      }).catch(function (error){
         console.log(error.toJSON())
      })
   } catch(err:any){
      console.log("NESUPJEŠAN ZAHTJEV ZA DOHVAT COUNTA")
   }

  }, [user])

  //dohvaćanje poruka s backenda
  useEffect(() => {
   
   if(user != null){
   try{
      axiosPrivate.get(
         '/messages'
      ).then(function (response){
         setMessages(response.data)     
      }).catch(function(error){
         console.log("GREŠKA")
         console.log(error.toJSON())
      })
   } catch(err:any){
      console.log("NESUPJEŠAN ZAHTJEV ZA DOHVAT PORUKA")
   }
   }
  }, [user])

  //ekstraktanje id iz message
  

  //dohvaćanje poruka od pošiljatelja
   const handleDialogClose = () => {
    setOpen(false)

       
    if(user != null) {
       try{
      axiosPrivate.get(
         '/messages/unreadCount'
      ).then(function (response){
         setCount(response.data)
         console.log(response.data)
      }).catch(function (error){
         console.log(error.toJSON())
      })
      } catch(err:any){
         console.log("NESUPJEŠAN ZAHTJEV ZA DOHVAT COUNTA")
      }
    }


  }

   const descriptionElementRef = React.useRef<HTMLElement>(null);
   React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
   }, [open]);


  return (
   <>
      <Dialog open={open} 
         onClose={handleDialogClose} 
         scroll={scroll} 
         aria-labelledby="scroll-dialog-title"
         aria-describedby="scroll-dialog-description"
      >

         <DialogTitle id="scroll-dialog-title">Notifications</DialogTitle>
         <DialogContent dividers={scroll === 'paper'}>
            <DialogContentText 
               id="scroll-dialog-description"
               ref={descriptionElementRef}
            >
               
               <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
               {//treba dodati dohvaćene poruke za logiranog usera
               }
                  <ListItem key={Math.random()}>
                     <ListItemText primary={"You have " + count.count + " unread messages"}>
                     </ListItemText>
                  </ListItem> 
               </List>
            </DialogContentText>
         </DialogContent>
      </Dialog>


     <IconButton size="large" edge="end" color="inherit" onClick={(e) => {handleDialogOpen('body')}}>
         {count.count > 0 &&
         <Badge badgeContent={count.count} color="secondary">
               <NotificationsIcon />
         </Badge>
         }
         {count.count <= 0 &&
            <NotificationsIcon />
         }
      </IconButton>
   </>
            
  )
}

export default NotificationComponent

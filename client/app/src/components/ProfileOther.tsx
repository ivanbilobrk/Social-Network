import { Avatar, Grid, Card, Paper, Box, CardHeader, CardMedia, Typography, CardContent, Menu, MenuItem, Stack, Button, List, ListItem, ListItemAvatar, ListItemText, Dialog, DialogContent, DialogTitle, DialogContentText, DialogProps } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import getUser from '../util/getUser';
import Popover from '@mui/material/Popover';

function ProfileOther({ userId, username, firstname, lastname, noOfFollowers, noOfFollowing, noOfPosts, profilePic }: any) {

  let [follow, setFollow] = useState(false);
  let [data, setData] = useState();
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let isAllowed = true;
    const getData = async() => {
      try {
        let response = await axiosPrivate.get('/users/' + userId);
        if(isAllowed) {
          setData(response.data);
        }
      } catch(err) {
        console.error(err);
      }
    }
    getData();
    return () => {
      isAllowed = false;
    }
  }, [userId]);

  let newId = 0;

  if(data != null) {
    newId = parseInt(data['id']);
  }

  const [open, setOpen] = useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  }

  const handleClose = () => {
    setOpen(false);
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

  const [open1, setOpen1] = useState(false);
  const [scroll1, setScroll1] = React.useState<DialogProps['scroll']>('paper');

  const handleClickOpen1 = (scrollType: DialogProps['scroll']) => () => {
    setOpen1(true);
    setScroll1(scrollType);
  }

  const handleClose1 = () => {
    setOpen1(false);
  }

  const descriptionElementRef1 = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open1) {
      const { current: descriptionElement } = descriptionElementRef1;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open1]);

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    let isAllowed = true;
    const getData = async () => {
      try {

        if (userId != null) {
          console.log("USERID u zahtjevu u ProfileOther: ", userId)
          const response = await axiosPrivate.get('/users/' + userId + '/followers');

          if (isAllowed) {
            setFollowers(response.data);
          }
        }
      } catch (err: any) {
        console.log(err.toJSON());
      }
    };

    getData();

    return () => {
      isAllowed = false;
    };
  }, [userId]);

  

  const [followings, setFollowings] = useState([]);

    useEffect(() => {
      let isAllowed = true;
      const getData = async () => {
        try {
          const user = getUser();
  
          if (user != null) {
            console.log("UserId u drugom zahtjevu u ProfileOther: ", userId)
            const response = await axiosPrivate.get('/users/' + userId + '/followings');
  
            if (isAllowed) {
              setFollowings(response.data);
            }
          }
        } catch (err: any) {
          console.log(err.toJSON());
        }
      };
  
      getData();
  
      return () => {
        isAllowed = false;
      };
    }, [userId]);

    const [followings1, setFollowings1] = useState([]);
    
    
    useEffect(() => {
      let isAllowed = true;
      const getData = async () => {
        try {
          let user = getUser();
  
          if (user != null) {
            console.log("UserId u trećem zahtjevu u ProfileOther: ", user.id)
            const response = await axiosPrivate.get('/users/' + user.id + '/followings');
  
            if (isAllowed) {
              setFollowings1(response.data);
            }
          }
        } catch (err: any) {
          console.log(err.toJSON());
        }
      };
  
      getData();
  
      return () => {
        isAllowed = false;
      };
    }, [userId]);

    console.log(followings1);

    let alreadyFollowing = false;

    for(const following of followings1) {
      
      if(following['id'] == userId) {
        console.log("uspjeh");
        alreadyFollowing = true;
      }
    }

    console.log(alreadyFollowing);

    useEffect(() => {
      console.log("ISPIS followers, followings, followings1")
      console.log(followers)
      console.log(followings)
      console.log(followings1)
    })

    useEffect(() => {
      setFollow(false);
    }, []);

    const refreshPage = () => {
        window.location.reload();
    }
    
    

  async function changeFollowState() {
      try {
        const user = getUser();
        if(user !== null) {
          let response = await axiosPrivate.post('/users/' + newId + '/follow');
          //console.log(response.data);
          if(response.data.count) {
            setFollow(false);
          } else {
            setFollow(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
      refreshPage();
  }

  console.log(follow);

  

  return ( 
  <Grid container direction = "column" marginTop={5}>
    <Card variant="elevation"
          style={{ width: '100%', aspectRatio: 1.2, maxHeight: '20rem', minHeight: '20rem' }}
          sx={{ my: '1rem' }}>
      <CardHeader style={{ backgroundColor: 'silver', height: 75 }}></CardHeader>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          m: 2,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -12,
          marginBottom: -1,
        }}
      >
        <Avatar alt="Remy Sharp" 
                src={profilePic} 
                sx = {{width:120, height:120}}/>

      </Box>
      <Grid container alignItems="center" justifyContent="center" direction="column">
        <Grid item xs={12}>
          <Typography sx={{ m: 1 }} variant="h5">
            @{username}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ m: 1 }}>{firstname} {lastname}</Typography>
        </Grid>
      </Grid>

      <Grid
        container
        alignItems="center"
        justifyContent="space-around"
        direction="row"
        textAlign="center"
        marginBottom={2}
        marginTop={2}
      >
        <Grid item xs={4} sx={{ borderRight: 1, borderColor: 'silver' }}>
          <Typography variant="h6"> {noOfPosts} </Typography>
          <Typography>Posts</Typography>
        </Grid>
        <Grid item xs={4} sx={{ borderRight: 1, borderColor: 'silver' }}>
        <Typography variant="h6" onClick = {handleClickOpen('body')}>{followers.length}</Typography>
          <Dialog
            open={open}
            onClose={handleClose}
            scroll={scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle id="scroll-dialog-title">Followers</DialogTitle>
            <DialogContent dividers={scroll === 'paper'}>
              <DialogContentText 
                id="scroll-dialog-description"
                ref={descriptionElementRef}
              >
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {followers.map((follower : any) => (
                  <ListItem key = {`${follower.id}`} component = 'a' href = {`/users/:${follower.id}`} sx = {{color: 'black'}}>
                    <ListItemAvatar>
                      <Avatar alt = {`${follower.id}`} src = {follower.avatar_url}>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary = {follower.username}>
                    </ListItemText>
                  </ListItem>
                )
              )}
            </List>
              </DialogContentText>
            </DialogContent> 
          </Dialog>
          <Typography>Followers</Typography>
        </Grid>
        <Grid item xs={4}>
        <Typography variant="h6" onClick = {handleClickOpen1('body')}>{followings.length}</Typography>
          <Dialog
            open={open1}
            onClose={handleClose1}
            scroll={scroll1}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogTitle id="scroll-dialog-title">Following</DialogTitle>
            <DialogContent dividers={scroll1 === 'paper'}>
              <DialogContentText
                id="scroll-dialog-description"
                ref={descriptionElementRef1}
              >
                <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {followings.map((following : any) => (

                  <ListItem key = {`${following.id}`} component = 'a' href = {`/users/:${following.id}`} sx = {{color: 'black'}}>
                    <ListItemAvatar>
                      <Avatar alt = {`${following.id}`} src = {following.avatar_url}>
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary = {following.username}>
                    </ListItemText>
                  </ListItem>
                ))}
                </List>
              </DialogContentText>
            </DialogContent>
          </Dialog>
          <Typography>Following</Typography>
        </Grid>
      </Grid>
    </Card>
    <Grid
        container
        alignItems="center"
        justifyContent="space-around"
        direction="row"
        textAlign="center"
        marginBottom={2}
        marginTop={2}
      >
        <Button onClick = {changeFollowState} variant = "outlined">{(follow || alreadyFollowing) ? "UNFOLLOW" : "FOLLOW"}</Button>
        <Button variant = "outlined" href = '/inbox'>MESSAGE</Button>
      </Grid>
  </Grid>

  );
};

export default ProfileOther;
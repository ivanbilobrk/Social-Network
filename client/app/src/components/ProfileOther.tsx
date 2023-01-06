import { Avatar, Grid, Card, Paper, Box, CardHeader, CardMedia, Typography, CardContent, Menu, MenuItem, Stack, Button, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
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

  const [anchorEl2, setAnchorEl2] = React.useState<HTMLButtonElement | null>(null);
  const [anchorEl3, setAnchorEl3] = React.useState<HTMLButtonElement | null>(null);

  const handleClick2 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClick3 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl3(event.currentTarget);
  }

  const handleClose2 = () => {
    setAnchorEl2(null);
  };
  const handleClose3 = () => {
    setAnchorEl3(null);
  }

  const open2 = Boolean(anchorEl2);
  const id2 = open2 ? 'simple-popover' : undefined;

  const open3 = Boolean(anchorEl3);
  const id3 = open3 ? 'simple-popover' : undefined;

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    let isAllowed = true;
    const getData = async () => {
      try {
        const user = getUser();

        if (user != null) {
          const response = await axiosPrivate.get('/users/' + newId + '/followers');

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
            const response = await axiosPrivate.get('/users/' + newId + '/followings');
  
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

    console.log(followings);

    const [followings1, setFollowings1] = useState([]);
    useEffect(() => {
      let isAllowed = true;
      const getData = async () => {
        try {
          const user = getUser();
  
          if (user != null) {
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
    }, []);

    let alreadyFollowing = false;

    followings1.forEach((el: any, index: any) => {
      if(el.id === newId) {
        alreadyFollowing = true;
      }} )

  async function changeFollowState() {
    try {
      const user = getUser();
      if(user !== null) {
        let response = await axiosPrivate.post('/users/' + newId + '/follow');
        console.log(response.data);
        if(response.data.count) {
          setFollow(false);
        } else {
          setFollow(true);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  return ( 
  <Grid container direction = "column" marginTop={5}>
    <Card>
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
        <Typography variant="h6" onClick = {handleClick2}>{noOfFollowers}</Typography>
          <Popover
            id={id2}
            open={open2}
            anchorEl={anchorEl2}
            onClose={handleClose2}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
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
          </Popover>
          <Typography>Followers</Typography>
        </Grid>
        <Grid item xs={4}>
        <Typography variant="h6" onClick = {handleClick3} >{noOfFollowing}</Typography>
          <Popover
            id={id3}
            open={open3}
            anchorEl={anchorEl3}
            onClose={handleClose3}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
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
                ))
              }
            </List>
          </Popover>
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
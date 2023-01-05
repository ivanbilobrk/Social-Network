import { Avatar, Grid, Card, Box, CardHeader, Typography, Popover, List, Autocomplete, Link, ListItem, ListItemAvatar, Divider, ListItemText} from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import getUser from '../util/getUser';

function Profile({ userId, username, firstname, lastname, noOfFollowers, noOfFollowing, noOfPosts, profilePic }: any) {

  const axiosPrivate = useAxiosPrivate();
  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [anchorEl1, setAnchorEl1] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick1 = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl1(event.currentTarget);
  }

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClose1 = () => {
    setAnchorEl1(null);
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const open1 = Boolean(anchorEl1);
  const id1 = open1 ? 'simple-popover' : undefined;

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    let isAllowed = true;
    const getData = async () => {
      try {
        const user = getUser();

        if (user != null) {
          const response = await axiosPrivate.get('/users/' + user.id + '/followers');

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
  }, []);

  

  const [followings, setFollowings] = useState([]);

    useEffect(() => {
      let isAllowed = true;
      const getData = async () => {
        try {
          const user = getUser();
  
          if (user != null) {
            const response = await axiosPrivate.get('/users/' + user.id + '/followings');
  
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
    }, []);

    


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
          <Typography variant="h6" onClick = {handleClick}>{noOfFollowers}</Typography>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
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
          <Typography variant="h6" onClick = {handleClick1}>{noOfFollowing}</Typography>
          <Popover
            id={id1}
            open={open1}
            anchorEl={anchorEl1}
            onClose={handleClose1}
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
  </Grid>

  );
};

export default Profile;

import { Avatar, Grid, Card, Paper, Box, CardHeader, CardMedia, Typography, CardContent, Menu, MenuItem, Stack, Button } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import getUser from '../util/getUser';

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
    newId = data['id'];
  }

  async function changeFollowState() {
    let data = JSON.stringify({
      userId: newId
    });
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
          <Typography variant="h6">{noOfFollowers}</Typography>
          <Typography>Followers</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">{noOfFollowing}</Typography>
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
        <Button onClick = {changeFollowState} variant = "outlined">{follow ? "UNFOLLOW" : "FOLLOW"}</Button>
        <Button variant = "outlined">MESSAGE</Button>
      </Grid>
  </Grid>

  );
};

export default ProfileOther;
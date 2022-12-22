import { Avatar, Grid, Card, Paper, Box, CardHeader, CardMedia, Typography, CardContent, Menu, MenuItem } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import getUser from '../util/getUser';

function Profile({ userId, username, firstname, lastname, noOfFollowers, noOfFollowing, noOfPosts }: any) {

  const ITEM_HEIGHT = 48;

  type UserT = {
    firstName: string;
    lastName: string;
    userName: string;
    key: number
  };
  
  const followers: UserT[] = [];
  
  
  const getIdByUsername = (userName:string) =>{
      return (followers.filter(user=>user.userName == userName))[0];
  }

  const [isLoading, setLoading] = useState(true);
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();   

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
  
    const getData = async () => {
        try {
            const user = getUser();
            
            if(user !== null){
                const response = await axios.get('/users/:' + user.id + '/followers');
                response.data.forEach((el:any, index:any)=>{followers[index] = {userName: el.username, key:parseInt(el.id), firstName: el.first_name, lastName: el.last_name}})
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

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const options = followers.map((option) => {return option.userName + " " + option.firstName+ " " +option.lastName})

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
                src="https://source.unsplash.com/random" 
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
          <Typography id= "followersButton" onClick = {handleClick}>Followers</Typography>
          <Menu
            id="long-menu"
            MenuListProps={{
              'aria-labelledby': 'folllowersButton',
            }}
            anchorEl={anchorEl}
            open={open}
      
          PaperProps={{
            style: {
              maxHeight: ITEM_HEIGHT * 4.5,
              width: '20ch',
            },
          }}
          >
          
          {options.map((option) => (
            
              <MenuItem >
            {option}
          </MenuItem>
        ))}
      </Menu>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">{noOfFollowing}</Typography>
          <Typography>Following</Typography>
        </Grid>
      </Grid>
    </Card>
  </Grid>

  );
};

export default Profile;

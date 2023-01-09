import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { useNavigate, useLocation } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import jwt_decode from 'jwt-decode';
import getUser from '../util/getUser';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { Grid } from '@mui/material';
import Profile from '../components/Profile';
import ProfileFeed from '../components/ProfileFeed';
import React from 'react';
import ProfileOther from '../components/ProfileOther';

export default function ProfilePage() {
  const { userId } = useParams();
  const [data, setData] = React.useState(null);
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const logout = useLogout();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [profilePic, setProfilePic] = useState<string>();

  const newUserId = userId?.substring(1);

  console.log(newUserId);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
          const response = await axiosPrivate.get('/users/' + newUserId);
          console.log(response.data);
          isMounted && setData(response.data);
          setProfilePic(response.data.avatar_url);
        
      } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [newUserId]);

  let newId = 0;

  if(data !== null) {
    newId = data['id'];
  }


  useEffect(() => {
    let isAllowed = true;
    const getData = async () => {
      try {
          const response = await axiosPrivate.get('/posts');

          if (isAllowed) {
            setPosts(response.data);
          }
      } catch (err: any) {
        console.log(err.toJSON());
      }
    };

    getData();

    return () => {
      isAllowed = false;
    };
  }, [newUserId]);

  const filtered = posts.filter(post => {
    return post['authorId'] === newId;
  });
  console.log(filtered);
  const noOfPosts = filtered.length;


  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    let isAllowed = true;
    const getData = async () => {
      try {
          const response = await axiosPrivate.get('/users/' + newUserId + '/followers');

          if (isAllowed) {
            setFollowers(response.data);
          }
        } catch (err: any) {
            console.log(err.toJSON());
        }
    };

    getData();

    return () => {
      isAllowed = false;
    };
  }, [newUserId]);


    let noOfFollowers;

    if(followers !== null) {
      noOfFollowers = followers.length;
    }

    const [followings, setFollowings] = useState([]);

    useEffect(() => {
      let isAllowed = true;
      const getData = async () => {
        try {
            const response = await axiosPrivate.get('/users/' + newUserId + '/followings');
  
            if (isAllowed) {
              setFollowings(response.data);
            }
          
        } catch (err: any) {
          console.log(err.toJSON());
        }
      };
  
      getData();
  
      return () => {
        isAllowed = false;
      };
    }, [newUserId]);


    let noOfFollowings;
    if(followings !== null) {
      noOfFollowings = followings.length;
    }

    console.log(noOfFollowings);

  const signout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <>
      <NavBar />
        <Grid container direction="column" alignItems="center" justifyContent="center">
          <Grid item width="40%">
            {data && <ProfileOther
              userId={newUserId}
              username={data['username']}
              firstname={data['first_name']}
              lastname={data['last_name']}
              noOfFollowers={noOfFollowers}
              noOfFollowing={noOfFollowings}
              noOfPosts={noOfPosts}
              profilePic = {profilePic}
            ></ProfileOther> }
            <ProfileFeed userId = {newUserId}></ProfileFeed>
          </Grid>
        </Grid>
    </>
  );
}

export { ProfilePage };

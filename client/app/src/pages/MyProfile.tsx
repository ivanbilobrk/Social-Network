import { Grid } from '@mui/material';
import Profile from '../components/Profile';
import NavBar from '../components/NavBar';
import Home from './Home';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import getUser from '../util/getUser';
import { useNavigate, useLocation } from 'react-router-dom';
import useLogout from '../hooks/useLogout';
import axios from '../api/axios';
import Post from '../components/home/Post';
import ProfileFeed from '../components/ProfileFeed';

function MyProfile(props: any) {

  const [data, setData] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const logout = useLogout();
  const location = useLocation();
  const [posts, setPosts] = useState([]);
  const [profilePic, setProfilePic] = useState<string>()

  useEffect(() => {
    let isAllowed = true;
    const getData = async () => {
      try {
        const user = getUser();

        if (user != null) {
          const response = await axiosPrivate.get('/posts?authorId=' + user.id);

          if (isAllowed) {
            setPosts(response.data);
            setProfilePic(response.data.avatar_url);
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

  console.log(posts);

  let noOfPosts;

  const filtered = posts.filter(post => {
    return post['authorId'] === getUser()?.id;
  });

  noOfPosts = filtered.length;

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        const user = getUser();

        if (user != null) {
          
          const response = await axios.get(
            '/users/' + user.id
          );
          console.log(response.data);
          isMounted && setData(response.data);
        }
      } catch (err) {
        console.error(err);
        
      }
    };

    getData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    let isAllowed = true;
    const getData = async () => {
      try {
        const user = getUser();

        if (user != null) {
          const response = await axios.get('/users/:' + user.id + '/followers');

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

    let noOfFollowers;

    if(followers !== null) {
      noOfFollowers = followers.length;
    }

    const [followings, setFollowings] = useState([]);

    useEffect(() => {
      let isAllowed = true;
      const getData = async () => {
        try {
          const user = getUser();
  
          if (user != null) {
            const response = await axios.get('/users/:' + user.id + '/followings');
  
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

    let noOfFollowing;
    if(followings !== undefined) {
      noOfFollowing = followings.length;
    }

   return (
      <>
        <NavBar />
        <Grid container direction="column" alignItems="center" justifyContent="center">
          <Grid item width="40%">
            {data && <Profile
              userId={data['id']}
              username={data['username']}
              firstname={data['first_name']}
              lastname={data['last_name']}
              noOfFollowers={noOfFollowers}
              noOfFollowing={noOfFollowing}
              noOfPosts={noOfPosts}
              profilePic = {profilePic}
            ></Profile> }
            <ProfileFeed></ProfileFeed>
          </Grid>
        </Grid>
      </>
      );
    
}

export default MyProfile;

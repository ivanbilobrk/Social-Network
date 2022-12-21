import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

export default function ProfilePage() {
  const [data, setData] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const logout = useLogout();
  const location = useLocation();
  const [id, setId] = useState(getUser()?.id);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        const user = getUser();

        //samo primjer nekog requesta
        if (user !== null) {
          const response = await axios.get('/users/' + id);
          console.log(response.data);
          isMounted && setData(response.data);
        }
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
  }, [id]);

  const [posts, setPosts] = useState([]);

  
  useEffect(() => {
    let isAllowed = true;
    const getData = async () => {
      try {
        const user = getUser();

        if (user != null) {
          const response = await axiosPrivate.get('/users/:' + user.id + '/posts');

          if (isAllowed) {
            setPosts(response.data);
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

  if(posts != null) {
    noOfPosts = posts.length;
  }

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

    let noOfFollowings;
    if(followings !== undefined) {
      noOfFollowings = followings.length;
    }

  const signout = async () => {
    await logout();
    navigate('/');
  };

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
              followers={noOfFollowers}
              following={noOfFollowings}
              noOfPosts={noOfPosts}
            ></Profile> }
            <ProfileFeed></ProfileFeed>
          </Grid>
        </Grid>
    </>
  );
}

export { ProfilePage };

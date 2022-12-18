import { Grid } from '@mui/material';
import Profile from '../components/Profile';
import NavBar from '../components/NavBar';
import Home from './Home';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import getUser from '../util/getUser';
import { useNavigate, useLocation } from 'react-router-dom';
import useLogout from '../hooks/useLogout';


let posts = [
  {
    username: 'sammy1',
    date: '2021-10-10',
    description: ' ',
    noOfLikes: 20,
  },
  {
    username: 'sammy1',
    date: '2021-10-10',
    description: ' ',
    noOfLikes: 20,
  },
  {
    username: 'sammy1',
    date: '2021-10-10',
    description: ' ',
    noOfLikes: 20,
  },
];

const followers = 1234;
const following = 10;

let noOfPosts = posts.length;

function MyProfile(props: any) {
  const [data, setData] = useState();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const logout = useLogout();
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        const user = getUser();
        if (user !== null) {
          const response = await axiosPrivate.get(`/user/${user.id}`, {});
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
  
 
  return (
    <>
      <NavBar />
      <Grid container direction="column" alignItems="center" justifyContent="center">
        <Grid item width="40%">
        {data && 
          <Profile
            userId={data['id']}
            username={data['username']}
            firstname={data['first_name']}
            lastname={data['last_name']}
            followers={followers}
            following={following}
            noOfPosts={noOfPosts}
          ></Profile>
        }
          <Home></Home>
        </Grid>
      </Grid>
    </>
  );
}

export default MyProfile;

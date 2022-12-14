import {Grid} from '@mui/material';
import Profile from '../components/Profile';
import Header from '../components/Header';
import Home from './Home'

const username = "sammy1";
const fullname = "Samantha Jones";
const followers = 12345;
const following = 10;


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
]

let noOfPosts = posts.length;

const MyProfile = () => {
    return (
        <>
        <Header></Header>
        <Grid container direction = "column" alignItems = "center" justifyContent = "center">
            <Grid item width = "40%">
                <Profile username = {username} fullname = {fullname} followers = {followers} following = {following}  noOfPosts = {noOfPosts}/>
                <Home posts = {posts}></Home>
            </Grid>
        </Grid>
        </>
    );
};

export default MyProfile;
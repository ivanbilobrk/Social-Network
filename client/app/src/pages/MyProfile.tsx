import {Grid} from '@mui/material';
import Profile from '../components/Profile';
import Header from '../components/Header';

const username = "sammy1";
const fullname = "Samantha Jones";
const followers = 12345;
const following = 10;
const posts = 10;

const MyProfile = () => {
    return (
        <>
        <Header></Header>
        <Grid container direction = "column" alignItems = "center" justifyContent = "center">
            <Grid item width = "40%">
                <Profile username = {username} fullname = {fullname} followers = {followers} following = {following}  posts = {posts}/>
            </Grid>
        </Grid>
        </>
    );
};

export default MyProfile;
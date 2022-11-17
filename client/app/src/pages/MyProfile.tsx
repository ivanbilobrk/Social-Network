import {Grid} from '@mui/material';
import Profile from '../components/Profile';

function MyProfile(props : any) {
    return (
        
        <Profile username = {props.username} fullname = {props.fullname} followers = {props.followers} following = {props.following}  posts = {props.posts}/>
    )
}

export default MyProfile;
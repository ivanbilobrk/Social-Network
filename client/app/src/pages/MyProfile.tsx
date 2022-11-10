import {Grid} from '@mui/material';
import Profile from '../components/Profile';

function MyProfile(props : any) {
    return (
        <Profile info = {props.info} />
    )
}

export default MyProfile;
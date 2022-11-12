import {Grid, Card, Paper, Box, CardHeader, CardMedia, Typography, CardContent} from '@mui/material';


const Profile = ({username, fullname, followers, following} : any) => (
    <Box width = "700px" height="400px">
        <Card>
        <Typography component = "div" variant = "h5" sx = {{p: 2}}>
                My Profile
        </Typography>
        <Card sx = {{display: 'flex'}}>
            <Box component = "img"
                sx = {{
                    width: 150,
                    height: 150,
                    minHeight:150,
                    minWidth:150,
                    maxHeight: 150,
                    maxWidth: 150,
                    m: "2rem"
                 }}
                 alt = "Profile picture"
                 src = "https://source.unsplash.com/random"
            />
                
    
            <Grid container alignItems = "center" justifyContent = "space-evenly" textAlign = "center" sx = {{margin: 2}}>
                <Grid item xs = {6}>
                    <Typography>{username}</Typography>
                </Grid>
                <Grid item xs = {6}>
                    <Typography>{fullname}</Typography>
                </Grid>
                <Grid item xs = {6}>
                    <Typography>{followers}</Typography>
                    <Typography>Followers</Typography>
                </Grid>
                <Grid item xs = {6}>
                    <Typography>{following}</Typography>
                    <Typography>Following</Typography>
                </Grid>
                

            </Grid>

            
        </Card>
        </Card>
    </Box>
)

export default Profile;
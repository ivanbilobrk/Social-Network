import {Grid, Card, Paper, Box, CardHeader, CardMedia, Typography, CardContent} from '@mui/material';


const Profile = ({username, fullname, followers, following, posts} : any) => (
    <Box width = "700px" height="400px">
        <Card>
        <Typography component = "div" variant = "h5" sx = {{p: 2, fontWeight: "bold"}}>
                {username}
        </Typography>
        <Card sx = {{display: 'flex'}}>
            <Box sx = {{ m: 2}}>
                <i 
                    style = {{
                        borderRadius: "50%",
                        width: 150,
                        height: 150,
                        display: "block",
                        background: `url('https://source.unsplash.com/random')`,
                        backgroundPosition: "center"
                    }}
                    />
                <Typography sx = {{m: 1}}>{fullname}</Typography>
            </Box>
                
    
            <Grid container alignItems = "center" justifyContent = "space-evenly" textAlign = "center" sx = {{margin: 2}}>
                <Grid item xs = {4}>
                    <Typography variant = "h6">{posts}</Typography>
                    <Typography>Posts</Typography>
                </Grid>
                <Grid item xs = {4}>
                    <Typography variant = "h6">{followers}</Typography>
                    <Typography>Followers</Typography>
                </Grid>
                <Grid item xs = {4}>
                    <Typography variant = "h6">{following}</Typography>
                    <Typography>Following</Typography>
                </Grid>
                

            </Grid>

            
        </Card>
        </Card>
    </Box>
)

export default Profile;
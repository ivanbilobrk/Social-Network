import {Grid, Card, Paper, Box, CardHeader, CardMedia, Typography, CardContent} from '@mui/material';


const Profile = ({username, fullname, followers, following, posts} : any) => (
    <Box width = "700px" height="400px">
        <Card >
        <CardHeader style = {{backgroundColor: 'silver', height: 75}} ></CardHeader>
        
            <Box sx = {{ display: 'flex', flexDirection: 'row', m: 2, alignItems: 'center', justifyContent: 'center', marginTop: -12, marginBottom: -1}}>
                <i 
                    style = {{
                        borderColor: 'silver',
                        borderRadius: "50%",
                        width: 150,
                        height: 150,
                        display: "block",
                        background: `url('https://source.unsplash.com/random')`,
                        backgroundPosition: "center"
                    }}
                    />
             </Box>
             <Grid container alignItems = "center" justifyContent = "center" direction = "column">
                <Grid item xs = {12}>
                <Typography sx = {{m:1}} variant = "h5">@{username}</Typography>
                </Grid>
                <Grid item xs = {12}>
                <Typography sx = {{m: 1}}>{fullname}</Typography>
                </Grid>
             </Grid>
    
            <Grid container alignItems = "center" justifyContent = "space-around" direction = "row" textAlign = "center" marginBottom={2} marginTop= {2}>
                <Grid item xs = {4} sx = {{borderRight: 1, borderColor: 'silver'}}>
                    <Typography variant = "h6">{posts}</Typography>
                    <Typography>Posts</Typography>
                </Grid>
                <Grid item xs = {4} sx = {{borderRight: 1, borderColor: 'silver'}}>
                    <Typography variant = "h6">{followers}</Typography>
                    <Typography>Followers</Typography>
                </Grid>
                <Grid item xs = {4}>
                    <Typography variant = "h6">{following}</Typography>
                    <Typography>Following</Typography>
                </Grid>
                

            </Grid>

            
        </Card>
        
    </Box>
)


export default Profile;
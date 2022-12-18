import { Avatar, Grid, Card, Paper, Box, CardHeader, CardMedia, Typography, CardContent } from '@mui/material';

const Profile = ({ username, firstname, lastname, followers, following, noOfPosts }: any) => (
  <Grid container direction = "column" marginTop={5}>
    <Card>
      <CardHeader style={{ backgroundColor: 'silver', height: 75 }}></CardHeader>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          m: 2,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -12,
          marginBottom: -1,
        }}
      >
        <Avatar alt="Remy Sharp" 
                src="https://source.unsplash.com/random" 
                sx = {{width:120, height:120}}/>

      </Box>
      <Grid container alignItems="center" justifyContent="center" direction="column">
        <Grid item xs={12}>
          <Typography sx={{ m: 1 }} variant="h5">
            @{username}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography sx={{ m: 1 }}>{firstname} {lastname}</Typography>
        </Grid>
      </Grid>

      <Grid
        container
        alignItems="center"
        justifyContent="space-around"
        direction="row"
        textAlign="center"
        marginBottom={2}
        marginTop={2}
      >
        <Grid item xs={4} sx={{ borderRight: 1, borderColor: 'silver' }}>
          <Typography variant="h6"> {noOfPosts} </Typography>
          <Typography>Posts</Typography>
        </Grid>
        <Grid item xs={4} sx={{ borderRight: 1, borderColor: 'silver' }}>
          <Typography variant="h6">{followers}</Typography>
          <Typography>Followers</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6">{following}</Typography>
          <Typography>Following</Typography>
        </Grid>
      </Grid>
    </Card>
  </Grid>
);

export default Profile;

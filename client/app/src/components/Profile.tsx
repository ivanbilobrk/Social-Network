import {Grid, Card, Paper, Box, CardHeader, CardMedia} from '@mui/material';

const Profile = ({username, fullname, followers, following} : any) => (
    <Box width = "500px" height="300px">
        <Card sx={{ display: 'flex' }}>
            <CardHeader title = "Moj profil"></CardHeader>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                    component = "img"
                    sx={{ width: 100 }}
                    image= "..."
                    alt = 'Profilna slika'
                />
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                     <Grid item xs={6}>
                        <Paper>{username}</Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper>{fullname}</Paper>
                    </Grid>
                    <Grid item xs={6}>
                        <Paper>{followers}</Paper>
                     </Grid>
                    <Grid item xs={6}>
                        <Paper>{following}</Paper>
                    </Grid>
                </Grid>
            </Box>
            
        </Card>
    </Box>
)

export default Profile;
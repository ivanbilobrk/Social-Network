import { Avatar, Box, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import { date } from 'yup';

function Comment(props: any) {
  // this is not doing anything smart, just a skeleton for now
  <Card
    variant="elevation"
    style={{ backgroundColor: 'silver', width: '100%', aspectRatio: 1.2, maxHeight: '30rem' }}
    sx={{ my: '1rem' }}
  >
    <CardHeader avatar={<Avatar alt="Remy Sharp" src="https://source.unsplash.com/random" />} title={props.username} />
    <Box
      component="img"
      sx={{ width: '100%', height: '17rem', objectFit: 'cover' }}
      alt="The house from the offer."
      src="https://source.unsplash.com/random"
    />
    <Box />

    <CardActions>
      <Grid container direction={'row'} justifyContent="flex-start" alignItems={'center'}></Grid>
    </CardActions>
    <CardContent sx={{ pt: '0rem' }}>
      <Typography variant="body1" component="div">
        {props.description}
      </Typography>
    </CardContent>
  </Card>;
}

export default Comment;

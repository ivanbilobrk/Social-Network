import { Avatar, Box, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';

function Post({ username, date, description, noOfLikes }: any) {
  let [liked, setLiked] = useState(false);

  function changeLikeState() {
    setLiked((prevState) => !prevState);
  }

  return (
    <Card
      variant="elevation"
      style={{ backgroundColor: 'silver', width: '100%', aspectRatio: 1.2, maxHeight: '30rem' }}
      sx={{ my: '1rem' }}
    >
      <CardHeader
        avatar={<Avatar alt="Remy Sharp" src="https://source.unsplash.com/random" />}
        title={username}
        subheader={date}
      />
      <Box
        component="img"
        sx={{ width: '100%', height: '17rem', objectFit: 'cover' }}
        alt="The house from the offer."
        src="https://source.unsplash.com/random"
      />
      <Box />

      <CardActions>
        <Grid container direction={'row'} justifyContent="flex-start" alignItems={'center'}>
          <Grid item xs={1}>
            <IconButton onClick={changeLikeState}>{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
          </Grid>
          <Grid item xs={1}>
            <Typography variant="overline" fontSize={15}>
              {liked ? noOfLikes + 1 : noOfLikes}
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <IconButton>
              <ChatBubbleOutlineOutlinedIcon />
            </IconButton>
          </Grid>
        </Grid>
      </CardActions>
      <CardContent sx={{ pt: '0rem' }}>
        <Typography variant="body1" component="div">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Post;

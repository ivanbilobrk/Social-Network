import { Avatar, Card, CardContent, IconButton, Typography } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';

function Comment(props: any) {
  let [liked, setLiked] = useState(false);
  let [likes, setLikes] = useState(props.likes);

  function changeLikeState() {
    setLiked((prevState) => !prevState);
    // TODO add like to backend
  }

  return (
    <Card
      variant="elevation"
      style={{ backgroundColor: 'silver', aspectRatio: 1.2, maxHeight: '5rem' }}
      sx={{ m: '0.5rem', display: 'flex', flexDirection: 'row', width: '95%', justifyContent: 'space-between' }}
    >
      <CardContent sx={{ pt: 0, display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ height: '30px', width: '30px', aspectRatio: '1', bgcolor: deepOrange[500] }}>LK</Avatar>
        <Typography component="div">{props.content}</Typography>
        <IconButton onClick={changeLikeState}>{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
        <Typography variant="overline" fontSize={15}>
          {liked ? props.likes + 1 : props.likes}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Comment;

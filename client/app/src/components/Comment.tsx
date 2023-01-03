import { Avatar, Card, CardContent, IconButton, Typography } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

function Comment(props: any) {
  let [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(props.likedBy ? props.likedBy.length + 1 : 0);
  const axiosPrivate = useAxiosPrivate();

  async function changeLikeState() {
    try {
      let response = await axiosPrivate.post(`/comments/${props.id}/like`, {});
      console.log(response.data);
      if (response.data.count) {
        setLiked(false);
      } else {
        setLiked(true);
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <Card
      variant="elevation"
      style={{ backgroundColor: 'silver', aspectRatio: 1.2, maxHeight: '5rem' }}
      sx={{
        m: '0.5rem',
        display: 'flex',
        flexDirection: 'row',
        width: '95%',
      }}
    >
      <CardContent sx={{ pt: 0, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
        <Avatar sx={{ height: '30px', width: '30px', aspectRatio: '1', bgcolor: deepOrange[500], mr: 1 }}>
          {props.profile.username[0].toUpperCase()}
        </Avatar>
        <Typography component="div">{props.content}</Typography>
        <IconButton onClick={changeLikeState}>{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
        <Typography variant="overline" fontSize={15}>
          {liked ? likes + 1 : likes}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Comment;

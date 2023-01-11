import { Avatar, Card, CardContent, IconButton, Typography } from '@mui/material';
import { deepOrange } from '@mui/material/colors';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import getUser from '../util/getUser';

function Comment(props: any) {
  let [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(props.likedBy ? props.likedBy.length : 0);
  let [localLike, setLocalLike] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    let user = getUser();
    if (props.likedBy) {
      props.likedBy.forEach((element: any) => {
        if (user !== null && element.id === user.id) {
          setLiked(true);
          setLocalLike(0);
        } else {
          setLiked(false);
          setLocalLike(0);
        }
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function changeLikeState() {
    try {
      let response = await axiosPrivate.post(`/comments/${props.id}/like`, {});
      console.log(response.data);
      if (response.data.count) {
        setLiked(false);
        setLocalLike((prev) => prev - 1);
      } else {
        setLiked(true);
        setLocalLike((prev) => prev + 1);
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
        <Avatar src={props.profile.avatar_url} sx={{ height: '30px', width: '30px', aspectRatio: '1', bgcolor: deepOrange[500], mr: 1 }}>
        </Avatar>
        <Typography component="div">{props.content}</Typography>
        <IconButton onClick={changeLikeState}>{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
        <Typography variant="overline" fontSize={15}>
          {likes + localLike}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default Comment;

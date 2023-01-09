import { Avatar, Box, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useEffect, useState } from 'react';
import AddCommentPopup from '../AddCommentPopup';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import getUser from '../../util/getUser';

function Post(props: any) {
  let [liked, setLiked] = useState(false);
  let [localLike, setLocalLike] = useState(0);
  let [isAddCommentOpen, setisAddCommentOpen] = useState<boolean>(false);
  const [noComments, setNoComments] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    //fetching users who liked the post
    const getData = async () => {
      try {
        let response = await axiosPrivate.get(`posts/${props.postId}/likes`);
        let postResponse = await axiosPrivate.get(`posts/${props.postId}`);
        let user = getUser();

        if (user != null) {
          response.data.forEach((element: any) => {
            if (element.id === user!.id) {
              setLiked(true);
              setLocalLike(0);
            } else {
              setLiked(false);
              setLocalLike(0);
            }
          });
          setNoComments(postResponse.data.comments.length);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, []);

  async function changeLikeState() {
    try {
      let response = await axiosPrivate.post(`/posts/${props.postId}/like`, {});
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

  function handleAddCommentOpen() {
    setisAddCommentOpen(!isAddCommentOpen);
  }

  return (
    <>
      <Card
        variant="elevation"
        style={{ backgroundColor: 'silver', width: '100%', aspectRatio: 1.2, maxHeight: '28rem', minHeight: '28rem' }}
        sx={{ my: '1rem' }}
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{ bgcolor: '#c173f5' }}
              alt={props.author.first_name + ' ' + props.author.last_name}
              src={props.author.avatar_url}
            >
              {props.author.first_name[0] + props.author.last_name[0]}
            </Avatar>
          }
          title={props.author.username}
        />
        <Box
          component="img"
          sx={{ width: '100%', height: '17rem', objectFit: 'cover' }}
          alt="Failed to load image"
          src={props.photo}
        />
        <Box />

        <CardActions>
          <Grid container direction={'row'} justifyContent="flex-start" alignItems={'center'}>
            <Grid item xs={1}>
              <IconButton onClick={changeLikeState}>{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="overline" fontSize={15}>
                {props.likes + localLike}
              </Typography>
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={handleAddCommentOpen}>
                <ChatBubbleOutlineOutlinedIcon />
              </IconButton>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="overline" fontSize={15}>
                {noComments}
              </Typography>
            </Grid>
          </Grid>
        </CardActions>
        <CardContent sx={{ pt: '0rem' }}>
          <Typography variant="body1" component="div">
            {props.description}
          </Typography>
        </CardContent>
      </Card>

      <AddCommentPopup
        open={isAddCommentOpen}
        onClose={() => setisAddCommentOpen(false)}
        postPhoto={props.photo}
        postId={props.postId}
      />
    </>
  );
}

export default Post;

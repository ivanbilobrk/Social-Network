import { Avatar, Box, Card, CardActions, CardContent, CardHeader, Grid, IconButton, Typography } from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState } from 'react';
import AddCommentPopup from '../AddCommentPopup';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function Post({ props }: any) {
  let [liked, setLiked] = useState(false);
  let [isAddCommentOpen, setisAddCommentOpen] = useState<Boolean>(false);
  const axiosPrivate = useAxiosPrivate();

  async function changeLikeState() {
    try {
      setLiked((prevState) => !prevState);
      await axiosPrivate.post(`/posts/${props.postId}/like`, {});
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
        style={{ backgroundColor: 'silver', width: '100%', aspectRatio: 1.2, maxHeight: '30rem' }}
        sx={{ my: '1rem' }}
      >
        <CardHeader avatar={<Avatar alt="Remy Sharp" />} title={'mock title'} />
        <Box
          component="img"
          sx={{ width: '100%', height: '17rem', objectFit: 'cover' }}
          alt="The house from the offer."
          src={'https://picsum.photos/200/300'}
        />
        <Box />

        <CardActions>
          <Grid container direction={'row'} justifyContent="flex-start" alignItems={'center'}>
            <Grid item xs={1}>
              <IconButton onClick={changeLikeState}>{liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}</IconButton>
            </Grid>
            <Grid item xs={1}>
              <Typography variant="overline" fontSize={15}>
                {2}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <IconButton onClick={handleAddCommentOpen}>
                <ChatBubbleOutlineOutlinedIcon />
              </IconButton>
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

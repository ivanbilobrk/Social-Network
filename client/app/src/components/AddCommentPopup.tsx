import { Alert, Box, Button, Container, Dialog, Grid, List, Paper, TextField, Typography } from '@mui/material';
import { CSSProperties, MouseEvent, useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import Comment from './Comment';
import getUser from '../util/getUser';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

type Props = {
  open: boolean;
  onClose: any;
  postPhoto: string;
  postId: number;
};

const AddCommentPopup = ({ open, onClose, postPhoto, postId }: Props) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [commentText, setCommentText] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();
  const [comments, setComments] = useState<any>([]);
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    setErrors([]);
  }, [open]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getData = async () => {
      try {
        const user = getUser();

        if (user !== null) {
          const comments = await axiosPrivate.get(`/posts/${postId}/comments`);
          isMounted && setComments(comments.data);
        }
      } catch (err: any) {
        setErrors([err.response.data.message]);
        onClose();
      }
    };

    getData();

    return () => {
      isMounted = false;
      controller.abort();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, open]);

  if (!open) return null;

  function handleComment(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>): void {
    if (!commentText) {
      setErrors([]);
      setErrors(['Comment text is required']);
      return;
    }
    setErrors((prev) => prev.filter((error) => error !== 'Comment text is required'));

    const postData = async () => {
      try {
        const user = getUser();

        if (user !== null) {
          await axiosPrivate.post(`/posts/${postId}/comment`, {
            content: commentText,
          });
          setCommentText('');
          setRefresh((prev) => !prev);
        }
      } catch (err: any) {
        setErrors([err.response.data.message]);
      }
    };
    postData();
  }

  return (
    <Dialog onClose={onClose} open={open} fullScreen>
      <Container
        sx={{
          backgroundColor: 'white',
          padding: '20px 20px',
          borderRadius: '10px',
          margin: '0 auto',
        }}
      >
        <Button onClick={onClose} variant="outlined" sx={{ marginBottom: '10px', justifySelf: 'flex-end' }}>
          <ClearIcon />
        </Button>

        <form>
          {errors.length > 0 &&
            errors.map((err, key) => (
              <Alert severity="error" key={key}>
                {err}
              </Alert>
            ))}
          <Grid container justifyContent="center">
            <Grid item xs={6}>
              <Grid container justifyContent="center" spacing={1} rowSpacing={2}>
                <Grid xs={12} item style={{ textAlign: 'center' }}>
                  {postPhoto !== undefined && (
                    <Box
                      component="img"
                      alt="profile pic"
                      src={postPhoto}
                      sx={{ width: '100%', aspectRatio: '1.25', objectFit: 'cover' }}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid xs={6} item>
              <Grid container justifyContent="center" alignContent="center">
                <Grid xs={12} item>
                  <Paper style={{ maxHeight: '25.2rem', overflow: 'auto' }}>
                    <List style={{ minHeight: '25.2rem' }}>
                      {comments.map((comment: any) => (
                        <Comment
                          key={comment.id}
                          content={comment.content}
                          id={comment.id}
                          profileId={comment.profileId}
                          profile={comment.profile}
                          likedBy={comment.liked_by}
                        />
                      ))}
                      {comments.length === 0 && (
                        <Box justifyContent="center" display="flex">
                          <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ width: 0.4, minHeight: '50vh' }}
                          >
                            <Typography sx={{ textAlign: 'center', mb: 2, fontSize: 24, fontWeight: 800 }}>
                              {' '}
                              No comments... yet!{' '}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </List>
                  </Paper>
                </Grid>
                <TextField
                  type="text"
                  label="Comment"
                  variant="outlined"
                  fullWidth
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid item>
              <Button size="large" variant="outlined" color="primary" onClick={(e) => handleComment(e)} sx={{ m: 2 }}>
                Comment
              </Button>
            </Grid>
            <Grid item>
              <Button size="large" variant="outlined" color="secondary" onClick={onClose} sx={{ m: 2 }}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </Dialog>
  );
};

export default AddCommentPopup;

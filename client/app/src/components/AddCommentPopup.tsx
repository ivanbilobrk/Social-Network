import { Alert, Box, Button, Container, Grid, List, Paper, TextField } from '@mui/material';
import { CSSProperties, useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import Comment from './Comment';
import getUser from '../util/getUser';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

type Props = {
  open: Boolean;
  onClose: any;
  postPhoto: string;
};

const OVERLAY: CSSProperties = {
  position: 'fixed',
  top: '0',
  left: '0',
  right: '0',
  bottom: '0',
  paddingTop: '50px',
  backgroundColor: 'rgba(0,0,0,0.7)',
  zIndex: '1000',
};

const AddCommentPopup = ({ open, onClose, postPhoto }: Props) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [commentText, setCommentText] = useState<string>('');
  const axiosPrivate = useAxiosPrivate();
  const [comments, setComments] = useState<any>([]);

  useEffect(() => {
    setErrors([]);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    // mapping posts to comments because there is no getComments endpoint
    const getData = async () => {
      try {
        const user = getUser();

        if (user !== null) {
          const comments = await axiosPrivate.get('/posts', {});
          isMounted && setComments(comments.data);
        }
      } catch (err) {
        console.error(err);
        onClose();
      }
    };

    getData();

    return () => {
      isMounted = false;
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  if (!open) return null;

  return (
    <div style={OVERLAY}>
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
          <Grid container justifyContent="center" spacing={1} rowSpacing={2}>
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
              <Grid container justifyContent="center" alignContent="center" spacing={1} rowSpacing={2}>
                <Grid xs={12} item>
                  <Paper style={{ maxHeight: 400, overflow: 'auto' }} sx={{ border: 1 }}>
                    <List>
                      {comments.map((comment: { id: any; content: any }) => (
                        <Comment key={comment.id} content={comment.content} />
                      ))}
                    </List>
                  </Paper>
                </Grid>
                <TextField
                  type="text"
                  label="Comment"
                  variant="outlined"
                  fullWidth
                  sx={{ ml: 1, mt: 1 }}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </Grid>
            </Grid>
            <Grid item>
              <Button size="large" variant="outlined" color="primary">
                Comment
              </Button>
            </Grid>
            <Grid item>
              <Button size="large" variant="outlined" color="secondary" onClick={onClose}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Container>
    </div>
  );
};

export default AddCommentPopup;

import { Alert, Box, Button, Container, Fab, Grid, List, Paper, TextField } from '@mui/material';
import { CSSProperties, useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

let comments = {
  comments: [
    {
      id: 1,
      text: 'Wow, this image is stunning!',
      author: 'Lovro Kovacic',
      authorId: 1,
      postId: 1,
    },
    {
      id: 2,
      text: 'The editing is kind of wonky',
      author: 'Ela Kumer',
      authorId: 2,
      postId: 1,
    },
    {
      id: 3,
      text: 'These are so rare! It is so great to see them!',
      author: 'Bobbly Blobily',
      authorId: 3,
      postId: 1,
    },
  ],
};

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

  useEffect(() => {
    setErrors([]);
  }, []);

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
                      sx={{ width: '100%', height: '17rem', objectFit: 'cover' }}
                    />
                  )}
                </Grid>
              </Grid>
            </Grid>

            <Grid xs={6} item>
              <Grid container justifyContent="center" alignContent="center" spacing={1} rowSpacing={2}>
                <Grid xs={12} item>
                  <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
                    <List>{/* TODO add mapping to comments */}</List>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Button size="large" variant="outlined" color="primary">
                Post
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

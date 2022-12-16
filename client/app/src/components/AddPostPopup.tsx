import { Alert, Box, Button, Container, Fab, Grid, TextField } from '@mui/material';
import { CSSProperties, useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import getUser from '../util/getUser';

type Props = {
  open: Boolean;
  onClose: any;
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

const AddPostPopup = ({ open, onClose }: Props) => {
  const [PostPhoto, setPostPhoto] = useState<Blob>();
  const [PostText, setPostText] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const title = 'this is hardcoded, i do not know what to do with it';
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    setErrors([]);
  }, []);

  function profilePictureChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.files) {
      setPostPhoto(e.target.files[0]);
    }
  }

  if (!open) return null;

  function handlePostUpdate() {
    if (!PostText) {
      setErrors(['Post text is required']);
      return;
    }
    let isMounted = true;
    const controller = new AbortController();

    const getData = async () => {
      try {
        const user = getUser();

        if (user !== null) {
          const formData = new FormData();
          formData.append('title', title);
          formData.append('content', PostText);
          formData.append('image', PostPhoto as Blob);

          const response = await axiosPrivate.post('/posts', formData);
        }
      } catch (err) {
        console.error(err);
      }
    };

    getData();
    onClose();
  }

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
        <Button onClick={onClose} variant="contained" sx={{ marginBottom: '10px', justifySelf: 'flex-end' }}>
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
                <Grid item>
                  <input
                    hidden
                    id="contained-button-file"
                    type="file"
                    accept="image/*"
                    onChange={(e) => profilePictureChange(e)}
                  />
                  <label htmlFor="contained-button-file">
                    <Fab component="span">
                      <ImageSearchIcon />
                    </Fab>
                  </label>
                </Grid>
                <Grid xs={12} item style={{ textAlign: 'center' }}>
                  {PostPhoto !== undefined && (
                    <Box
                      component="img"
                      alt="profile pic"
                      src={URL.createObjectURL(PostPhoto)}
                      // the image has a round border
                      sx={{ width: 0.5, aspectRatio: 0.5, border: 3, borderRadius: '2%' }}
                    />
                  )}
                  {/* //TODO add a placeholder */}
                </Grid>
              </Grid>
            </Grid>

            <Grid xs={6} item>
              <Grid container justifyContent="center" alignContent="center" spacing={1} rowSpacing={2}>
                <Grid xs={12} item>
                  <TextField
                    type="text"
                    label="Description"
                    placeholder="Enter your description"
                    variant="outlined"
                    fullWidth
                    sx={{ width: '100%', height: '100%' }}
                    onChange={(e) => setPostText(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item>
              <Button size="large" variant="outlined" color="primary" onClick={handlePostUpdate}>
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

export default AddPostPopup;

import { Alert, Box, Button, Container, Grid, TextField } from '@mui/material';
import { CSSProperties, useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';

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
  const [PostPhoto, setPostPhoto] = useState<Blob | MediaSource>();
  const [PostText, setPostText] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setErrors([]);
    setPostPhoto(undefined);
  }, []);

  function profilePictureChange(e: React.ChangeEvent<HTMLInputElement>): void {
    setErrors((prev) => prev.filter((e) => e !== 'Image must be less than 10MB!'));

    if (
      e.target.files &&
      e.target.files[0] &&
      e.target.files[0].size < 10000000 &&
      e.target.files[0].type === 'image/jpeg'
    ) {
      setPostPhoto(e.target.files[0]);
    } else {
      setErrors((previousValue) => [...previousValue, 'Image must be less than 10MB!']);
    }
  }

  if (!open) return null;

  return (
    <div style={OVERLAY}>
      <Container
        sx={{
          backgroundColor: 'white',
          padding: '20px 20px',
          borderRadius: '10px',
          margin: '0 auto',
          maxWidth: '450px',
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
                <Grid xs={12} item>
                  <label>Picture to post {'  '}</label>
                  <input id="profile_file" type="file" accept="image/jpeg" onChange={(e) => profilePictureChange(e)} />
                </Grid>
                <Grid xs={12} item>
                  {PostPhoto !== undefined && (
                    <Box
                      component="img"
                      alt="profile pic"
                      src={URL.createObjectURL(PostPhoto)}
                      sx={{ width: 0.8, aspectRatio: 0.5 }}
                    />
                  )}
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
                    sx={{ width: '100%' }}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Button size="large" variant="contained" color="primary">
                Post
              </Button>
            </Grid>

            <Grid item>
              <Button size="large" variant="contained" color="secondary" onClick={onClose}>
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

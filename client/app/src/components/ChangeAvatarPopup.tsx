import { Alert, Box, Button, Container, Fab, Grid, TextField } from '@mui/material';
import { CSSProperties, useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';

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
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    setErrors([]);
    setPostPhoto(undefined);
  }, []);

  function profilePictureChange(e: React.ChangeEvent<HTMLInputElement>): void {
    if (e.target.files) {
      setPostPhoto(e.target.files[0]);
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
            <Grid item xs={12}>
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

            <Grid item>
              <Button size="large" variant="outlined" color="primary">
                Change profile picture
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

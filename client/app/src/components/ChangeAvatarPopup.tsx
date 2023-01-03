import { Alert, Box, Button, Container, Fab, Grid, TextField } from '@mui/material';
import { CSSProperties, useEffect, useState } from 'react';
import ClearIcon from '@mui/icons-material/Clear';
import ImageSearchIcon from '@mui/icons-material/ImageSearch';
import useAxiosPrivate from '../hooks/useAxiosPrivate';


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

const AvatarPopup = ({ open, onClose }: Props) => {
  const [PostPhoto, setPostPhoto] = useState<Blob>();
  const [errors, setErrors] = useState<string[]>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();

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


  const changeAvatar = async () => {
    //console.log(PostPhoto);
  if(PostPhoto !== undefined){

    setDisabled(true)
    let formData = new FormData()
    let number = Math.random() * (1000)
    formData.append('photo', PostPhoto, 'profilePic'+number);
    formData.append('_method', 'put');


    const response = await axiosPrivate.put(
      '/users',
      formData,
      {
         headers: {'Content-Type': 'multipart/form-data'}
      }
      ).then((response) => {
        console.log("Okej")
        //console.log(response.data)
        onClose()
        window.location.reload()
      }).catch(err => {
        console.log("Nije okej")
        //console.log(err.message)
      })
  } else{
    window.alert("Please choose image for profile picture!");
  }
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
                      sx={{ height: '300px', width: '300px', border: 'solid black 2px' }}
                    />
                  )}
                  {/* //TODO add a placeholder */}
                </Grid>
              </Grid>
            </Grid>

            <Grid item>
              <Button size="large" variant="outlined" color="primary" onClick={changeAvatar} disabled={disabled}>
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

export default AvatarPopup;

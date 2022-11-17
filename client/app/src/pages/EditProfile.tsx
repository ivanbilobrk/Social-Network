import { Avatar, Button, Container, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import EditForm from '../components/EditForm';
import Header from '../components/Header';
import CreateIcon from '@mui/icons-material/Create';

import profilePic from '../static/zuko.jpg';
import ChangePasswordPopUp from '../components/ChangePasswordPopUp';

const EditProfile = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);

  return (
    <>
      <Header />
      <Container maxWidth="xl" fixed sx={{ backgroundColor: '#cfebff', marginTop: '2%', padding: '20px 20px' }}>
        <Grid container justifyContent="center" padding="20px 20px" margin="20px">
          <Grid item>
            <Avatar
              variant="square"
              src={profilePic}
              sx={{ height: '300px', width: '300px', border: 'solid black 2px' }}
            />
            <Button variant="contained" sx={{ position: 'relative', top: '-10%' }}>
              <CreateIcon />
              <Typography variant="subtitle2" sx={{ marginLeft: '10px' }}>
                Edit profile picture
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <EditForm />

        <Grid container justifyContent="center" padding="40px 40px">
          <Grid item>
            <Button
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              size="large"
              variant="contained"
              color="primary"
            >
              Change password
            </Button>
          </Grid>
        </Grid>
      </Container>
      <ChangePasswordPopUp open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default EditProfile;

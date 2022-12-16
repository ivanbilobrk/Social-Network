import { Avatar, Button, Container, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import EditForm from '../components/EditForm';
import ChangeAvatarPopUp from '../components/ChangeAvatarPopup';
import NavBar from '../components/NavBar';
import CreateIcon from '@mui/icons-material/Create';
import axios from '../api/axios';

import profilePic from '../static/zuko.jpg';
import ChangePasswordPopUp from '../components/ChangePasswordPopUp';
import getUser from '../util/getUser';


const EditProfile = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState<Boolean>(false);

  const [user, setUser] = useState<any>(getUser())

  //dohvaća sve informacije o useru s backenda
  const getUserInfo = async (userId: number) => {
    try{
      const response = await axios.get(
        '/users/' + userId
      )
      
      console.log("Uspjeh")
      //console.log(response.data)
      setUser(response.data)


    } catch (err:any){
      console.log("Greška!")
    }
  }
  
  //treba poslati zahtjev za promjenom passworda na backend za starom i novom lozinkom
  const passwordChangeFunction = async (oldPass: string, newPass: string) =>{
    const response = await axios.post( //promjeni u axios private dodaj then, catch
      '/auth/change-password',
      JSON.stringify({
        user: getUserInfo(user.id),
        oldPassword: oldPass,
        newPassword: newPass
      }),
      {
          headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  return (
    <>
      <NavBar />
      <Container maxWidth="xl" fixed sx={{ backgroundColor: '#cfebff', marginTop: '2%', padding: '20px 20px' }}>
        <Grid container justifyContent="center" padding="20px 20px" margin="20px">
          <Grid item>
            <Avatar
              variant="square"
              src={profilePic}
              sx={{ height: '300px', width: '300px', border: 'solid black 2px' }}
            />
            <Button variant="contained" sx={{ position: 'relative', top: '-10%' }} onClick={() => {setIsChangeAvatarOpen(!isChangeAvatarOpen)}}>
              <CreateIcon />
              <Typography variant="subtitle2" sx={{ marginLeft: '10px' }}>
                Edit profile picture
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <EditForm submitFunction= {() => {
          ///////
          ///////
          ////////
          //dodaj funkciju za zahtjev prema backendu
          // promjena imena i prezimena
        }}/>

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
      <ChangePasswordPopUp open={isOpen} onClose={() => setIsOpen(false)}  onChange={passwordChangeFunction} />
    
      <ChangeAvatarPopUp open={isChangeAvatarOpen} onClose={() => setIsChangeAvatarOpen(false)} />
    </>
  );
};

export default EditProfile;

import { Avatar, Button, Container, Grid, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import EditForm from '../components/EditForm';
import ChangeAvatarPopUp from '../components/ChangeAvatarPopup';
import NavBar from '../components/NavBar';
import CreateIcon from '@mui/icons-material/Create';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

import ChangePasswordPopUp from '../components/ChangePasswordPopUp';
import getUser from '../util/getUser';

import { useNavigate } from 'react-router-dom';


const EditProfile = () => {
  const [isOpen, setIsOpen] = useState<Boolean>(false);
  const [isChangeAvatarOpen, setIsChangeAvatarOpen] = useState<Boolean>(false);
  const [user, setUser] = useState<any>(getUser())
  const [profilePic, setProfilePic] = useState<string>()
  const axiosPrivate = useAxiosPrivate()
  

  //dohvaća sve informacije o useru s backenda
  const getUserInfo = async (userId: number) => {
    try{
      const response = await axiosPrivate.get(
        '/users/' + userId
      )
      
      //console.log("Uspjeh")
      //console.log(response.data)
      setUser(response.data)
      setProfilePic(response.data.avatar_url)


    } catch (err:any){
      console.log("Greška!")
    }
  }

  useEffect(() => { 
    getUserInfo(user.id)
  }, [])
  
  
  const changeNameFunction = async (first: string, last: string) => {
    //console.log("Šaljem!")
    const response = await axiosPrivate.put(
      '/users',
      JSON.stringify({
        firstName: first,
        lastName: last
      }), 
      {
        headers: { 'Content-Type': 'application/json' },
      }
    )

    window.location.reload()
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
        <EditForm userInfo={user} requestFunction={changeNameFunction}/>

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
      <ChangePasswordPopUp open={isOpen} onClose={() => setIsOpen(false)}  />
    
      <ChangeAvatarPopUp open={isChangeAvatarOpen} onClose={() => setIsChangeAvatarOpen(false)} />
    </>
  );
};

export default EditProfile;

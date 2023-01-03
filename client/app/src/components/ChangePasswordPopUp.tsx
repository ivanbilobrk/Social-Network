import { Button, Container, Grid, TextField } from '@mui/material'
import {CSSProperties, useState} from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import useAxiosPrivate from '../hooks/useAxiosPrivate'

type Props = {
  open: Boolean,
  onClose: any
};

const OVERLAY: CSSProperties = {
   position: 'fixed',
   top: '0',
   left: '0',
   right: '0',
   bottom: '0',
   paddingTop: '50px',
   backgroundColor: 'rgba(0,0,0,0.7)',
   zIndex: '1000'
   
}

const ChangePasswordPopUp = ({ open, onClose }: Props) => {
  const [newPassword, setNewPassword] = useState<String>()
  const [oldPassword, setOldPassword] = useState<String>()
  const [newPasswordConfirmed, setNewPasswordConfirmed] = useState<String>()
  const axiosPrivate = useAxiosPrivate()
   if(!open) return null;

   const handleNewPassword = (event: any) => {
      setNewPassword(event.target.value);
   }

   const handleOldPassword = (event: any) => {
      setOldPassword(event.target.value)
   }

   const handleNewPasswordConfirmed = (event:any) => {
      setNewPasswordConfirmed(event.target.value)
   }

   const passwordChange = () =>{
      if(newPassword != newPasswordConfirmed || newPassword === undefined){
         window.alert("New password and confirm new password do not match!")
      } else {
         //provjera restrikcija na novi password
         if(newPassword.length < 8){
            window.alert("Password minimum length should be 8")
         }else if(!newPassword.match(/^(?=.{8,})(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=]).*$/)){
            window.alert("Password must contain at least one uppercase letter, one lowercase letter, number and special character")
         }else{
            //axios zahtjev za promjenom lozinke
         try{
            
            axiosPrivate.post(
               '/auth/change-password',
               JSON.stringify({
                  oldPassword: oldPassword,
                  newPassword: newPassword
               }),
               {
                  headers: { 'Content-Type': 'application/json' },
               },
            ).then(function (response){
               console.log(response.data);
               setTimeout(() => {
                  onClose()
               }, 500)
            }).catch(function (error) {
               if(oldPassword != newPassword){
                  window.alert("The old password is incorrect!")
               } else {
                  window.alert("Desired password is already in use.")
               }
               
               console.log(error.toJSON());
            });



         }catch(err :any){
            window.alert("Error: The old password is not correct!")
         }
         }

      }
   }

  

   return (
   <div style={OVERLAY}>
    <Container sx={{backgroundColor:'white', padding: '20px 20px',  borderRadius: '10px', margin: '0 auto', maxWidth: '450px'}}>  
      <Button onClick={onClose} variant="contained" sx={{marginBottom:'10px', justifySelf: 'flex-end'}}>
         <ClearIcon/>
      </Button>
      
      <form>
         
      <Grid container justifyContent="center" spacing={1} rowSpacing={2}>

      <Grid xs={12} item>
         <TextField type="password" name="oldPassword" label="Old Password" placeholder="Enter old password" variant="outlined" onChange={handleOldPassword} fullWidth />
      </Grid>

      <Grid xs={12} item>
         <TextField type="password" name="newPassword" label="New Password" placeholder="Enter new password" variant="outlined" onChange={handleNewPassword} fullWidth />
      </Grid>

      <Grid xs={12} item>
         <TextField type="password" name="confirmedPass" label="Confirm password" placeholder="Confirm new password" variant="outlined" onChange={handleNewPasswordConfirmed} fullWidth />
      </Grid>

      <Grid item>
         <Button size="large" variant="contained" color="primary" onClick={passwordChange}>Confirm</Button>
      </Grid>

       <Grid item>
         <Button size="large" variant="contained" color="secondary" onClick={onClose}>Cancel</Button>
      </Grid>
      
      
      </Grid>
      </form>
      </Container>
   </div>
  )
}

export default ChangePasswordPopUp

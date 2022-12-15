import { Button, Container, Grid, TextField } from '@mui/material'
import {CSSProperties, useState} from 'react'
import ClearIcon from '@mui/icons-material/Clear';
import axios from '../api/axios';

type Props = {
  open: Boolean,
  onClose: any,
  onChange: any
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

const ChangePasswordPopUp = ({ open, onClose, onChange }: Props) => {
  const [newPassword, setNewPassword] = useState<String>()
  const [oldPassword, setOldPassword] = useState<String>()
  const [newPasswordConfirmed, setNewPasswordConfirmed] = useState<String>()
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

   const testFunction = () =>{
      if(newPassword != newPasswordConfirmed){
         window.alert("New password and confirm new password do not match!")
      } else {
         //axios zahtjev za promjenom lozinke
         try{
            axios.post(
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
               window.alert("The old password is incorrect!")
               console.log(error.toJSON());
            });



         }catch(err :any){
            window.alert("Error: The old password is not correct!")
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
         <Button size="large" variant="contained" color="primary" onClick={testFunction}>Confirm</Button>
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

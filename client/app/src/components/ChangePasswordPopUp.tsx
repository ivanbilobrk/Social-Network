import { Button, Container, Grid, TextField } from '@mui/material'
import {CSSProperties} from 'react'
import ClearIcon from '@mui/icons-material/Clear';

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
  if(!open) return null;

   return (
   <div style={OVERLAY}>
    <Container sx={{backgroundColor:'white', padding: '20px 20px',  borderRadius: '10px', margin: '0 auto', maxWidth: '450px'}}>  
      <Button onClick={onClose} variant="contained" sx={{marginBottom:'10px', justifySelf: 'flex-end'}}>
         <ClearIcon/>
      </Button>
      
      <form>
         
      <Grid container justifyContent="center" spacing={1} rowSpacing={2}>

      <Grid xs={12} item>
         <TextField type="password" label="Old Password" placeholder="Enter old password" variant="outlined" fullWidth />
      </Grid>

      <Grid xs={12} item>
         <TextField type="password" label="New Password" placeholder="Enter new password" variant="outlined" fullWidth />
      </Grid>

      <Grid xs={12} item>
         <TextField type="password" label="Confirm password" placeholder="Confirm new password" variant="outlined" fullWidth />
      </Grid>

      <Grid item>
         <Button size="large" variant="contained" color="primary">Confirm</Button>
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

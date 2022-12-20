import { Button, Container, Grid, TextField} from '@mui/material'
import {useEffect, useState} from 'react'



const EditForm = ({requestFunction, userInfo} : any) => {
   const [firstName, setFirstName] = useState<String>()
   const [lastName, setLastName] = useState<String>()

   const handleFirstName = (event: any) => {
      setFirstName(event.target.value);
   }

   const handleLastName = (event: any) => {
      setLastName(event.target.value)
   }

   const submitFunction = () => {
      requestFunction(firstName, lastName)
   }
   
  return (
      <Container sx={{backgroundColor: "white", padding: '20px 20px', borderRadius: '10px', margin: '0 auto', maxWidth: '450px'}}>
      <form>
         
      <Grid container justifyContent="center" spacing={1} rowSpacing={2}>

      <Grid xs={12} item>
         <TextField type="text" label={userInfo.first_name} placeholder="Enter first name" variant="outlined" onChange={handleFirstName} fullWidth />
      </Grid>

      <Grid xs={12} item>
         <TextField type="text" label={userInfo.last_name} placeholder="Enter last name" variant="outlined" onChange={handleLastName} fullWidth />
      </Grid>

      <Grid item>
         <Button size="large" variant="contained" color="primary" onClick={submitFunction}>Save</Button>
      </Grid>
      
            
      </Grid>
      </form>
      </Container>
  )
}

export default EditForm

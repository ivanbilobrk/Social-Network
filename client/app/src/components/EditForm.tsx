import { Button, Container, Grid, TextField} from '@mui/material'

const EditForm = ({submitFunction} : any) => {
  return (
      <Container sx={{backgroundColor: "white", padding: '20px 20px', borderRadius: '10px', margin: '0 auto', maxWidth: '450px'}}>
      <form>
         
      <Grid container justifyContent="center" spacing={1} rowSpacing={2}>

      <Grid xs={12} item>
         <TextField type="text" label="First Name" placeholder="Enter first name" variant="outlined" fullWidth />
      </Grid>

      <Grid xs={12} item>
         <TextField type="text" label="Last Name" placeholder="Enter last name" variant="outlined" fullWidth />
      </Grid>

      <Grid item>
         <Button size="large" variant="contained" color="primary">Save</Button>
      </Grid>
      
      
      </Grid>
      </form>
      </Container>
  )
}

export default EditForm

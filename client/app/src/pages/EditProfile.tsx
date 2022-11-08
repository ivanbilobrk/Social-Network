import { Avatar, Badge, Box, Button, Container, Grid } from '@mui/material'
import React from 'react'
import EditForm from '../components/EditForm'
import Header from '../components/Header'
import CreateIcon from '@mui/icons-material/Create';

import profilePic from '../static/zuko.jpg'

const EditProfile = () => {
  return (
    <>
    <Header/>
    <Container maxWidth="xl" fixed sx={{backgroundColor: '#cfebff', marginTop: '2%', padding: '20px 20px'}}>
      
         <Grid container justifyContent="center" padding="20px 20px" margin='20px'>
            <Grid item>
               <Badge overlap="rectangular" anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} badgeContent={<CreateIcon color="action" /> }>
                   <Avatar variant="square" src={profilePic} sx={{height: '300px', width: '300px'}}/>
               </Badge>
            </Grid>
         </Grid>   
         <EditForm/>

         <Grid container justifyContent="center" padding="20px 20px" margin='20px'>
            <Grid item>
               <Button size="medium" variant="contained" color="primary">Change password</Button>
            </Grid>
         </Grid>
         
    </Container>
    </>
  )
}

export default EditProfile

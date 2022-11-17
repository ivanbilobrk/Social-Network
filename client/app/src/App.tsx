import React from 'react';
import {Grid} from '@mui/material';
import MyProfile from './pages/MyProfile';

const username = 'sammy1'
const fullname = 'Samantha Jones'
const followers = 12345
const following = 10
const posts = 10

function App() {
  return (
    <Grid container spacing = {0} direction = "column" alignItems = "center" justifyContent = "center">
        <Grid item width = "40%">
          <MyProfile username = {username} fullname = {fullname} followers = {followers} following = {following} posts = {posts} />
        </Grid>
    </Grid>
  );
}

export default App;

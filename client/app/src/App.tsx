import { Grid } from '@mui/material';
import React from 'react';
import Home from './pages/Home';

let posts = [
  {
    username: 'John Doe',
    date: '2021-10-10',
    description: 'I am having the time of my life rn',
    noOfLikes: 130,
  },
  {
    username: 'Ela Kumer',
    date: '2021-10-10',
    description: 'bla bla bla',
    noOfLikes: 140,
  },
  {
    username: 'Lovro Kovacic',
    date: '2021-10-10',
    description: 'bla bla bla',
    noOfLikes: 260,
  },
];

function App() {
  return (
    <Grid container direction="column" alignItems="center" justifyContent="center">
      <Grid item width="40%">
        <Home posts={posts} />
      </Grid>
    </Grid>
  );
}

export default App;

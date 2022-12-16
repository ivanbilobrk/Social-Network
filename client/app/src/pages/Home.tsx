import { Button, Grid } from '@mui/material';
import ScrollableFeed from '../components/home/ScrollableFeed';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import AddPostPopup from '../components/AddPostPopup';

function Home() {
  const [isAddPostOpen, setisAddPostOpen] = useState<Boolean>(false);

  return (
    <>
      <Grid container direction="column">
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ m: 3, alignSelf: 'start', borderColor: 'lightblue' }}
            onClick={() => {
              setisAddPostOpen(!isAddPostOpen);
            }}
          >
            Add Post
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ScrollableFeed forgroundColor="white" />
        </Grid>
      </Grid>

      <AddPostPopup open={isAddPostOpen} onClose={() => setisAddPostOpen(false)} />
    </>
  );
}
export default Home;

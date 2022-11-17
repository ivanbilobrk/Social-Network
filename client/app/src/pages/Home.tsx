import { Button, Grid } from '@mui/material';
import ScrollableFeed from '../components/home/ScrollableFeed';
import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import AddPostPopup from '../components/AddPostPopup';

function Home(props: any) {
  const [isOpen, setIsOpen] = useState<Boolean>(false);

  return (
    <>
      <Grid container direction="column">
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ m: 3, alignSelf: 'start', borderColor: 'lightblue' }}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
          >
            Add Post
          </Button>
        </Grid>
        <Grid item xs={12}>
          <ScrollableFeed posts={props.posts} forgroundColor="white" />
        </Grid>
      </Grid>

      <AddPostPopup open={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
export default Home;

import { Button, Grid } from '@mui/material';
import ScrollableFeed from '../components/home/ScrollableFeed';
import AddIcon from '@mui/icons-material/Add';

function Home(props: any) {
  return (
    <Grid container direction="column">
      <Grid item>
        <Button variant="outlined" startIcon={<AddIcon />} sx={{ m: 3, alignSelf: 'start', borderColor: 'lightblue' }}>
          Add Post
        </Button>
      </Grid>
      <Grid item xs={12}>
        <ScrollableFeed posts={props.posts} forgroundColor="white" />
      </Grid>
    </Grid>
  );
}
export default Home;

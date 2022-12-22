import { Button, Grid } from "@mui/material";
import React, { useState } from "react";
import AddPostPopup from "./AddPostPopup";
import AddIcon from '@mui/icons-material/Add';
import ScrollableProfileFeed from './ScrollableProfileFeed'


function ProfileFeed({userId} : any) {
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
            <ScrollableProfileFeed 
            userId = {userId} />
          </Grid>
        </Grid>
  
        <AddPostPopup open={isAddPostOpen} onClose={() => setisAddPostOpen(false)} />
      </>
    );
  }
  export default ProfileFeed;
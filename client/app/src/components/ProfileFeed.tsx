import { Button, Grid } from '@mui/material';
import React, { useState } from 'react';
import AddPostPopup from './AddPostPopup';
import AddIcon from '@mui/icons-material/Add';
import ScrollableProfileFeed from './ScrollableProfileFeed';
import getUser from '../util/getUser';

function ProfileFeed({ userId }: any) {
  console.log(userId);
  const [isAddPostOpen, setisAddPostOpen] = useState<Boolean>(false);
  const [refresh, setRefresh] = useState<Boolean>(false);

  return (
    <>
      <Grid container direction="column">
        <Grid item>
          {userId == getUser()?.id && (
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
          )}
        </Grid>
        <Grid item xs={12}>
          <ScrollableProfileFeed userId={userId} />
        </Grid>
      </Grid>

      <AddPostPopup
        open={isAddPostOpen}
        onClose={() => setisAddPostOpen(false)}
        refresh={() => setRefresh((prev) => !prev)}
      />
    </>
  );
}
export default ProfileFeed;

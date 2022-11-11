import { Grid, List, Paper } from '@mui/material';
import Post from './Post';

function ScrollableFeed(props: any) {
  return (
    <List sx={{ width: '100%' }}>
      {props.posts.map((post: any, index: any) => (
        <Post
          key={index}
          username={post.username}
          date={post.date}
          description={post.description}
          noOfLikes={post.noOfLikes}
        ></Post>
      ))}
    </List>
  );
}

export default ScrollableFeed;

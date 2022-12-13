import { List } from '@mui/material';
import Post from './Post';

function ScrollableFeed(props: any) {
  return (
    <List sx={{ width: '100%' }}>
      {props.posts.map((post: any, key: any) => (
        <Post
          key={key}
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

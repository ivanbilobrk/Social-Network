import { List } from '@mui/material';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import getUser from '../../util/getUser';
import Post from './Post';

function ScrollableFeed(props: any) {
  const axiosPrivate = useAxiosPrivate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let isAllowed = true;
    const getData = async () => {
      try {
        const user = getUser();

        if (user != null) {
          const response = await axiosPrivate.get('/posts', {});

          if (isAllowed) {
            setPosts(response.data);
          }
        }
      } catch (err: any) {
        console.log(err.toJSON());
      }
    };

    getData();

    return () => {
      isAllowed = false;
    };
  }, []);

  return (
    <List sx={{ width: '100%' }}>
      {posts.map((post: any, key: any) => (
        <Post
          key={key}
          postId={post.id}
          author={post.author.username}
          description={post.content}
          likes={post.likes}
          comments={post.comments}
        ></Post>
      ))}
    </List>
  );
}

export default ScrollableFeed;

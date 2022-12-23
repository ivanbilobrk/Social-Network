import { List } from '@mui/material';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import getUser from '../../util/getUser';
import Post from './Post';

function ScrollableFeed() {
  const axiosPrivate = useAxiosPrivate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const user = getUser();

        if (user != null) {
          const response = await axiosPrivate.get('/posts');
          setPosts(response.data);
        }
      } catch (err: any) {
        console.log(err.toJSON());
      }
    };

    getData();
  }, []);

  return (
    <List sx={{ width: '100%' }}>
      {posts.map((post: any, key: any) => (
        <Post
          key={key}
          postId={post.id}
          author={post.author}
          description={post.content}
          likes={post.likes}
          comments={post.comments}
          photo={post.photo}
        ></Post>
      ))}
    </List>
  );
}

export default ScrollableFeed;

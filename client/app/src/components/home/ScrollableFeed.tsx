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
      {posts.map((post: any) => (
        <Post
          key={post.id}
          postId={post.id}
          title={post.title}
          description={post.content}
          photo={post.photo}
          author={post.author}
          likes={post.likes}
        ></Post>
      ))}
    </List>
  );
}

export default ScrollableFeed;

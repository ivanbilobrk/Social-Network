import { List } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import getUser from '../../util/getUser';
import Post from './Post';

function ScrollableFeed(props: any) {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    const getData = async () => {
      try {
        const user = getUser();

        if (user !== null) {
          const posts = await axiosPrivate.get('/posts', {});
          console.log(posts.data);
          isMounted && setPosts(posts.data);
        }
      } catch (err) {
        console.error(err);
        navigate('/login', { state: { from: location }, replace: true });
      }
    };

    getData();

    return () => {
      isMounted = false;
      controller.abort();
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

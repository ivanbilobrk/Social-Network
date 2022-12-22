import { List } from '@mui/material';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import getUser from '../util/getUser';
import Post from './home/Post';
import axios from '../api/axios';
import User from '../interface/User';
import userEvent from '@testing-library/user-event';


function ScrollableProfileFeed({userId}: any) {
  const axiosPrivate = useAxiosPrivate();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let isAllowed = true;
    const getData = async () => {
      try {
          const response = await axios.get('/posts');

          if (isAllowed) {
            setPosts(response.data);
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

  const filtered = posts.filter(post => {
    return post['authorId'] === userId;
  });


  return (
    <List sx={{ width: '100%' }}>
      {filtered.map((post: any, key: any) => (
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

export default ScrollableProfileFeed;
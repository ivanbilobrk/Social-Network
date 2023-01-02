import { List } from '@mui/material';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import getUser from '../util/getUser';
import Post from './home/Post';
import axios from '../api/axios';
import User from '../interface/User';
import userEvent from '@testing-library/user-event';

function ScrollableProfileFeed(userId: any) {
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

  const filtered = posts.filter(post => {
    return post['authorId'] === userId;
  });

  console.log(userId);

  return (
    <List sx={{ width: '100%' }}>
      {filtered.map((post: any) => (
        <Post
          key={post.id}
          postId={post.id}
          title={post.title}
          author={post.author.username}
          description={post.content}
          likes={post.likes}
          photo={post.photo}
        ></Post>
      ))}
    </List>
  );
}

export default ScrollableProfileFeed;

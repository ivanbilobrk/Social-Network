import { List } from '@mui/material';
import { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import getUser from '../util/getUser';
import Post from './home/Post';
import axios from '../api/axios';
import User from '../interface/User';
import userEvent from '@testing-library/user-event';
import { getDatePickerToolbarUtilityClass } from '@mui/x-date-pickers/DatePicker/datePickerToolbarClasses';


function ScrollableProfileFeed({userId} : any) {
  console.log(userId);
  const axiosPrivate = useAxiosPrivate();
  const [posts, setPosts] = useState([]);
  const [newUser, setNewUser] = useState();


  useEffect(() => {
    let isAllowed = true;
    const getData = async () => {
      try {
        const response = await axiosPrivate.get('/posts');
        if(isAllowed) {
          setPosts(response.data.reverse());
        }
      } catch (err: any) {
        console.log(err.toJSON());
      }
    };

    getData();
    return () => {
      isAllowed = false;
    }
  }, [userId]);

  useEffect(() => {
    let isAllowed = true;
    const getData = async () => {
      try {
        const response = await axiosPrivate.get('/users/' + userId);
        if(isAllowed) {
          setNewUser(response.data);
        }
      } catch(err : any) {
        console.log(err.toJSON());
      }
    };
    getData();
    return() => {
      isAllowed = false;
    }
  }, [userId]);

  let newId = 0;

  if(newUser !== undefined) {
    newId = newUser['id'];
  }

  const filtered = posts.filter((post: any) => {
    return post['authorId'] === newId;
  })

  function removeElementAtIndex<T>(input: T[], index: number) {
    return input.slice(0, index).concat(input.slice(index + 1));
  }

  filtered.forEach((post:any, index: any) => {
    if(post.authorId !== newId) {
      filtered.splice(index, 1);
    }
  })
  //filtered.forEach((post: any, index: any) => {
    //if(post['authorId'] !== newId) {
      //removeElementAtIndex(filtered, index);
    //}
  //})
    
  console.log(filtered);


  return (
    <List sx={{ width: '100%' }}>
        {filtered.map((post: any) => (
        <Post
          key={post.id}
          postId={post.id}
          title={post.title}
          author={post.author}
          description={post.content}
          likes={post.likes}
          photo={post.photo}
        ></Post>
      
      ))}
    </List>
  );
}

export default ScrollableProfileFeed;

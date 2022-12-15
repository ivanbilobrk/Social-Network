import { List } from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import getUser from '../../util/getUser';
import Post from './Post';

function ScrollableFeed(props: any) {
  const axiosPrivate = useAxiosPrivate();
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  let isMounted = false;
  const controller = new AbortController();

  const getData = async () => {
    try{
      axios.get(
        '/posts/'
      ).then(function (response){
        setPosts(response.data)
      }).catch(function (error){
        window.alert("Neuspješno dohvćanje postova s backenda!")
      })
    }catch(err :any){
      console.log(err.toJSON());
    }
  };

  if(!isMounted){
    isMounted = true;
    getData()
  }

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

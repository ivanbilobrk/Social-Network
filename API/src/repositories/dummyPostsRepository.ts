export type DummyPost = {
  id: number;
  title: string;
  content: string;
  views: number;
};

const dummyDb: { posts: Array<DummyPost> } = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      content: 'Content of post 1',
      views: 0,
    },
    {
      id: 2,
      title: 'Post 2',
      content: 'Content of post 2',
      views: 0,
    },
  ],
};

export const getAllPosts = (): Array<DummyPost> => {
  return dummyDb.posts;
};

export const getPostById = (id: number): DummyPost | undefined => {
  return dummyDb.posts.find((post) => post.id === id);
};

export const createPost = (post: DummyPost): DummyPost => {
  const nextId = Math.max(...dummyDb.posts.map((t) => t.id)) + 1;
  const new_post: DummyPost = { ...post, id: nextId, views: 0 };
  dummyDb.posts.push(new_post);
  return new_post;
};

export const updatePost = (post: DummyPost): DummyPost | undefined => {
  const existing_post = dummyDb.posts.find((t) => t.id === post.id);
  if (existing_post) {
    existing_post.title = post.title;
    existing_post.content = post.content;
    existing_post.views = post.views;
    return existing_post;
  }
  return undefined;
};

export const deletePost = (id: number): boolean => {
  const index = dummyDb.posts.findIndex((t) => t.id === id);
  if (index >= 0) {
    dummyDb.posts.splice(index, 1);
    return true;
  }
  return false;
};

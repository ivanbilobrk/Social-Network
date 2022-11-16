export default interface Post {
  id?: number;
  title: string;
  content: string | null;
  photo: string | null;
  authorId: number;
  author?: {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
  };
  likes?: number;
}

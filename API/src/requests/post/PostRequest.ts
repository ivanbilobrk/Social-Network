export default interface PostRequest {
  id?: number;
  title: string;
  content: string | null;
  photo: string | null;
}

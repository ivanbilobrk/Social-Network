import FileData from '../fileData.js';

export default interface PostRequest {
  id?: number;
  title: string;
  content: string | null;
  photo: FileData | null;
}

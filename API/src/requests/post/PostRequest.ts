import { Readable } from 'stream';

export default interface PostRequest {
  id?: number;
  title: string;
  content: string | null;
  photo: {
    data: Readable;
    name: string;
    type: string;
  } | null;
}

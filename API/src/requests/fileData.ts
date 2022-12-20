import { Readable } from 'stream';

export default interface FileData {
  data: Readable;
  name: string;
  type: string;
}

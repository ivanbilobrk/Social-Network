import FileData from '../fileData.js';

export default interface UpdateUserRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  photo: FileData | null;
}

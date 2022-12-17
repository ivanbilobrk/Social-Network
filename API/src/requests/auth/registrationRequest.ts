import FileData from '../fileData.js';

export default interface RegistrationRequest {
  email: string;
  password: string;
  username: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  photo: FileData | null;
}

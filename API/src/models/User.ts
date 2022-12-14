export default interface User {
  id?: number;
  email: string;
  password_hash: string;
  last_login?: Date;
  user_type: 'user' | 'admin' | 'deleted';
  username: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date;
  joined_at: Date;
}

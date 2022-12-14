export default interface UserProfile {
  id?: number;
  email?: string;
  user_type: 'user' | 'admin' | 'deleted';
  username: string;
  first_name: string;
  last_name: string;
  date_of_birth: Date | null;
  joined_at: Date;
}

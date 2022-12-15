import User from '../interface/User';
import jwt_decode from 'jwt-decode';

export default function getUser(): User | null {
  if (!localStorage.getItem('accessToken')) {
    return null;
  } else {
    try {
      const accessToken: string = localStorage.getItem('accessToken') || '';
      const decoded: User = jwt_decode(accessToken);
      return decoded;
    } catch (error: any) {
      return null;
    }
  }
}
export { getUser };

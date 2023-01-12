import { useLocation, Navigate, Outlet } from 'react-router-dom';
import getUser from '../../util/getUser';

const RequireAuth = ({ allowedRoles }: { allowedRoles: string[] }) => {
  const location = useLocation();
  try {
    const user = getUser();
    if (user !== null) {
      return allowedRoles.find((role) => role === user.type) ? (
        <Outlet />
      ) : user?.id ? (
        <Navigate to="/unauthorized" state={{ from: location }} replace />
      ) : (
        <Navigate to="/login" state={{ from: location }} replace />
      );
    } else {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }
  } catch (error: any) {
    localStorage.removeItem('accessToken');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
};

export default RequireAuth;

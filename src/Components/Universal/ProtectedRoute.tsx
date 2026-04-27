import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface Props {
 
  adminOnly?: boolean; 
}

const ProtectedRoute = ({ adminOnly }: Props) => {
  const {isLoggedIn, isAdmin}= useAuth()
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/" />;
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
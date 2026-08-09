import { useAuth } from '../context/AuthContext';
import Menu from './Menu';
import AdminDashboard from './AdminDashboard';

const Home = () => {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminDashboard /> : <Menu />;
};

export default Home;

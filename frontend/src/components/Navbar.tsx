import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-gradient-to-r from-sweet-500 to-sweet-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🍬</span>
            <span className="text-xl font-bold">Sweet Shop</span>
          </Link>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="hover:text-sweet-200 transition-colors"
                >
                  Home
                </Link>
                {user?.role === 'ADMIN' && (
                  <Link
                    to="/admin"
                    className="hover:text-sweet-200 transition-colors"
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center space-x-3">
                  <span className="text-sm">
                    Hello, {user?.name}
                    {user?.role === 'ADMIN' && (
                      <span className="ml-1 px-2 py-0.5 bg-yellow-400 text-yellow-900 text-xs rounded-full">
                        Admin
                      </span>
                    )}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-white text-sweet-600 px-4 py-2 rounded-lg hover:bg-sweet-50 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="hover:text-sweet-200 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-sweet-600 px-4 py-2 rounded-lg hover:bg-sweet-50 transition-colors font-medium"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

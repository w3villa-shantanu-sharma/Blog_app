import React, { useContext, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const Layout = () => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username'); // Store username in localStorage during login
    if (token && username) {
      setUser({ username });
    }
  }, [setUser]);

  
  const handleLogout = () => {
    const confirmLogout = window.confirm('Are you sure you want to logout?');
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      setUser(null);
      navigate('/');
    }
  };

  const menu = [
    { text: 'Nature', path: '/' },
    { text: 'Technology', path: '/' },
    { text: 'Travel', path: '/' },
    { text: 'Food', path: '/' },
  ];

  return (
    <div>
      <div className="border-b">
        <div className="container px-5 py-5 flex justify-between items-center">
          <Link to="/">
            <span className="font-extrabold text-2xl">Blogger</span>
          </Link>
          <div className="flex items-center">
            <ul className="flex gap-5">
              {menu.map((item) => (
                <li key={item.text}>
                  <Link to={item.path} className="p-2 flex items-center justify-center">
                    <span>{item.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 items-center">
              {user ? (
                <>
                  <span className="text-gray-700 font-medium">Hello, {user.username}</span>
                  <Link
                    to="/create"
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Create Post
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signup"
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                  >
                    Signup
                  </Link>
                  <Link
                    to="/login"
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex mx-auto px-5 md:px-20">
        <div className="mt-5 mb-5 min-h-[500px] w-full">
          <Outlet />
        </div>
      </div>
      <div className="flex bg-slate-800">
        <div className="flex justify-center items-center mx-auto py-20">
          <h3 className="text-gray-500">Blogger</h3>
        </div>
      </div>
    </div>
  );
};

export default Layout;
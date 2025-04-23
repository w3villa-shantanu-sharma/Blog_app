import React, { useEffect, useState } from 'react';
import BlogCard from '../components/BlogCard';

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/blogs');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blogdata={blog} />
        ))}
      </div>
    </div>
  );
};

export default Home;
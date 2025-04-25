import React, { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const Createblog = () => {
  const blankBlog = {
    title: '',
    image: '',
    post: '<p><br></p>',
    category: '',
  };

  const [newblog, setNewblog] = useState(blankBlog);
  const menu = [
    { text: 'Nature', path: '/' },
    { text: 'Travel', path: '/' },
    { text: 'Technology', path: '/' },
    { text: 'Politics', path: '/' },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewblog({ ...newblog, [name]: value });
  };

  const handleQuillChange = (value) => {
    setNewblog({ ...newblog, post: value });
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to create a blog');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', newblog.title);
      formData.append('category', newblog.category);
      formData.append('post', newblog.post);
      formData.append('image', newblog.image);

      const response = await fetch('http://localhost:5001/api/blogs', {
        method: 'POST',
        headers: {
      
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        alert('Blog created successfully!');
        setNewblog(blankBlog); // Reset the form
      } else {
        const data = await response.json();
        alert(data.message || 'Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  return (
<div className="flex w-full items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 min-h-screen py-10">
  <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-lg">
    <h1 className="text-3xl font-bold text-indigo-600 mb-6 text-center">📝 Create a Blog Post</h1>
    <div className="flex flex-col gap-4">
      <label className="text-sm font-semibold text-gray-700">Title</label>
      <input
        type="text"
        name="title"
        value={newblog.title}
        onChange={handleChange}
        placeholder="Enter your blog title"
        className="h-10 border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      />

      <label className="text-sm font-semibold text-gray-700">Category</label>
      <select
        name="category"
        value={newblog.category}
        onChange={handleChange}
        className="h-10 border border-gray-300 rounded px-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
      >
        <option value="" disabled>Select Category</option>
        {menu.map((x) => (
          <option key={x.text} value={x.text}>{x.text}</option>
        ))}
      </select>

      <label className="text-sm font-semibold text-gray-700">Upload Image</label>
      <input
        type="file"
        name="image"
        onChange={(e) => setNewblog({ ...newblog, image: e.target.files[0] })}
        className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
      />

      <label className="text-sm font-semibold text-gray-700">Post Content</label>
      <ReactQuill
        value={newblog.post}
        onChange={handleQuillChange}
        className="bg-white rounded mb-2 mt-2"
        theme="snow"
      />

      <button
        onClick={handleSubmit}
        className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-6 mt-4 rounded transition duration-200"
      >
        ✨ Submit Blog
      </button>
    </div>
  </div>
</div>

  );
};

export default Createblog;
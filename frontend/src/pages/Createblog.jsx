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
    <div className="flex w-full items-center justify-center">
      <div className="bg-slate-200 w-[60%] p-5 rounded-xl">
        <h1 className="text-2xl mb-5">Create Blog Post</h1>
        <div className="flex flex-col">
          <label htmlFor="title" className="ml-1 text-gray-500">
            Title
          </label>
          <input
            type="text"
            name="title"
            value={newblog.title}
            onChange={handleChange}
            className="h-10 border border-gray-300 rounded my-2 p-2"
          />
          <label htmlFor="category" className="ml-1 text-gray-500">
            Category
          </label>
          <select
            name="category"
            value={newblog.category}
            onChange={handleChange}
            className="h-10 border border-gray-300 rounded my-2 p-2"
          >
            <option value="" disabled>
              Select Category
            </option>
            {menu.map((x) => (
              <option key={x.text} value={x.text}>
                {x.text}
              </option>
            ))}
          </select>
          <label htmlFor="image" className="ml-1 text-gray-500">
            Image
          </label>
          <input
            type="file"
            name="image"
            onChange={(e) => setNewblog({ ...newblog, image: e.target.files[0] })}
            className="border-gray-300 rounded my-2 p-2"
          />
          <label htmlFor="post" className="ml-1 text-gray-500">
            Post
          </label>
          <ReactQuill
            value={newblog.post}
            onChange={handleQuillChange}
            className="bg-white rounded mb-2 mt-2 editingarea"
            theme="snow"
          />

          <hr />
          <button
            onClick={handleSubmit}
            className="bg-slate-500 text-white h-8 w-[100px] mt-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Createblog;
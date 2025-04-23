import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const BlogDetails = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchBlog = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/blogs/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch blog');
        }
        const data = await response.json();
        setBlog(data);
        setLikes(data.likesCount || 0);
        setComments(data.comments || []);
      } catch (error) {
        console.error('Blog fetch error:', error);
      }
    };

    fetchBlog();
  }, [id]);

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to like the blog');
      return;
    }
  
    try {
      const response = await fetch('http://localhost:5001/api/likes/toggle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blogId: id }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setLiked(data.liked); // Update the liked state
        setLikes((prev) => (data.liked ? prev + 1 : prev - 1)); // Update the likes count
      } else {
        alert('Failed to toggle like');
      }
    } catch (error) {
      console.error('Like Error:', error);
    }
  };

  const handleCommentSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to comment');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ blogId: id, content: comment }),
      });
      if (response.ok) {
        const newComment = await response.json();
        setComments([...comments, newComment]);
        setComment('');
        alert('Comment added!');
      } else {
        alert('Failed to add comment');
      }
    } catch (error) {
      console.error('Comment submit error:', error);
    }
  };

  return (
    <div className="p-6">
      {blog && (
        <div>
          <h1 className="text-3xl font-bold">{blog.title}</h1>
          <img src={blog.image} alt={blog.title} className="w-full h-64 object-cover my-4" />
          <p>{blog.description}</p>
          <div className="flex items-center mt-4">
            <button
              onClick={handleLike}
              className={`px-4 py-2 rounded ${
                liked ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'
              }`}
              disabled={liked}
            >
              {liked ? 'Liked' : 'Like'}
            </button>
            <span className="ml-2">{likes} Likes</span>
          </div>
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold">Comments</h2>
        <div className="mt-4">
          {comments.map((c, index) => (
            <div key={index} className="border-b py-2">
              {c.content}
            </div>
          ))}
        </div>
        <textarea
          className="w-full p-2 border rounded mt-4"
          rows="3"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
          onClick={handleCommentSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default BlogDetails;



import React from 'react';
import   '../index.css';
import { Link } from 'react-router-dom';

const BlogCard = ({ blogdata }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <Link to={`/blog/${blogdata.id}`}>
        <div className="flex flex-col w-full">
          {/* Blog Image */}
          <img
            style={{ height: '200px', objectFit: 'cover' }}
            src={blogdata.image}
            alt="blog-image"
            className="w-full"
          />
          {/* Blog Content */}
          <div className="p-4">
            <h5 className="text-lg font-semibold text-gray-800 mb-2">{blogdata.title}</h5>
            <p className="text-sm text-gray-600 line-clamp-3">{blogdata.description}</p>
            <div className="flex justify-between items-center mt-4">
              <span className="text-sm text-gray-500">{blogdata.createdon}</span>
              <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors">
                Read More
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
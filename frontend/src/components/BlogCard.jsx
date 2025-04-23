import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ blogdata }) => {
  return (
    <div className="bg-white shadow-md overflow-hidden rounded-xl">
      {/* Ensure blogdata.id is passed correctly */}
      <Link to={`/blog/${blogdata.id}`}>
        <div className="flex flex-col w-full">
          <img style={{ height: '250px' }} src={blogdata.image} alt="blog-image" />
          <div className="p-2">
            <h5 className="mt-1 text-left">{blogdata.title}</h5>
            <p className="flex justify-start items-center opacity-50">{blogdata.description}</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default BlogCard;
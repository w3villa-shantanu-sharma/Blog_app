import React from 'react';

const Blog = ({ blog }) => {
  // Ensure that the 'blog' prop has the required structure for this component
  const { title, content, date, imageUrl} = blog;

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="flex flex-col w-[60%] overflow-hidden">
        <h1 className="text-3xl font-bold">{title}</h1>

        <div className="flex mt-5 mb-5">
          <small className="text-gray-500">{date}</small>
        </div>

        <img className="rounded-lg w-full mb-5" src={imageUrl} alt={title} />

        <div className="content text-lg text-gray-700">
          <p>{content}</p>
        </div>

        
      </div>
    </div>
  );
};

export default Blog;

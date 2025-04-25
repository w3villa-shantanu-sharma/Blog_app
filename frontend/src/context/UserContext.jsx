// filepath: /home/w3villa/Desktop/Blog-App/frontend/src/context/UserContext.jsx
import React, { createContext, useEffect, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {

  const storedUSer = JSON.parse(localStorage.getItem('user'));

  const [user, setUser] = useState(storedUSer || null);

  useEffect(()=>{
    if(user){
      localStorage.setItem('user', JSON.stringify(user));
    }else{
      localStorage.removeItem('user');
    }
  },[user]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
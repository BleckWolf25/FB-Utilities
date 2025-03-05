import React from 'react';
import Navbar from "../components/layout/Navbar";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to Home</h1>
       
      </div>
    </div>
  );
};

export default Home;
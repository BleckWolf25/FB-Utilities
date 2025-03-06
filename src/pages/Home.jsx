// src/pages/Home.jsx
import React from 'react';
import FadeIn from '../components/animations/FadeIn';
import Button from '../components/common/NavButton';
import Card from '../components/common/Card';


const Home = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <FadeIn>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Welcome to FB-Utilities</h1>
          
          <div className="mb-8">
            <p className="text-lg mb-4">
              This is your home page. Customize this content to showcase your application's 
              features and value proposition.
            </p>
            
            <Button>Get Started</Button>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            <Card title="Feature One">
              <p>Description of your first main feature goes here.</p>
            </Card>
            
            <Card title="Feature Two">
              <p>Description of your second main feature goes here.</p>
            </Card>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

export default Home;
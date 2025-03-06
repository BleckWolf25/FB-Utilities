// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import layout components
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Import page components
import Home from '../pages/Home';
// import About from '../pages/About';
// import Contact from '../pages/Contact';
import NotFound from '../pages/NotFound';

// Layout wrapper component that includes navbar and footer
const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
    <script src="http://localhost:8097"></script>
      {children}
    </main>
    <Footer />
  </div>
);

// Routes configuration
const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Routes with MainLayout */}
        <Route 
          path="/" 
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          } 
        />
        
        {/* Add more routes as your application grows */}
        {/* Route:
        <Route 
          path="/about" 
          element={
            <MainLayout>
              <About />
            </MainLayout>
          } 
        />
        
        <Route 
          path="/contact" 
          element={
            <MainLayout>
              <Contact />
            </MainLayout>
          } 
        />
        }
        
        {/* Route for handling 404 Not Found */}
        { 
        <Route 
          path="*" 
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          } 
        /> 
        }
        
        {/* Alternatively, redirect to home page if no matching route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
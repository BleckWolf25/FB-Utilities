// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Home from '../pages/Home';
import About from '../pages/About';
import NotFound from '../pages/NotFound';
import Converter from '../pages/Converter';
import Minifier from '../pages/Minifier';
import Unminifier from '../pages/Unminifier';
import Calculator from '../pages/Calculator';
import Temperature from '../pages/Temperature';
import UnitsConverter from '../pages/UnitsConverter';
import TimeZoneConverter from '../pages/TimeZoneConverter';
import TimestampGenerator from '../pages/TimestampGenerator';

// Layout wrapper component that includes navbar and footer
const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
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

        {/* Home Page */}
        <Route 
          path="/" 
          element={
            <MainLayout>
              <Home />
            </MainLayout>
          } 
        />
        
        {/* About Page */}
        <Route 
          path="/about" 
          element={
            <MainLayout>
              <About />
            </MainLayout>
          } 
        />
        
        {/* File Converter Page */}
        <Route 
          path="/converter" 
          element={
            <MainLayout>
              <Converter />
            </MainLayout>
          } 
        />

        {/* Units Converter Page */}
        <Route 
          path="/units" 
          element={
            <MainLayout>
              <UnitsConverter />
            </MainLayout>
          } 
        />

        {/* Time Zone Converter Page */}
        <Route 
          path="/timezone" 
          element={
            <MainLayout>
              <TimeZoneConverter />
            </MainLayout>
          } 
        />

        {/* Time Stamp Generator Page */}
        <Route 
          path="/timestamp" 
          element={
            <MainLayout>
              <TimestampGenerator />
            </MainLayout>
          } 
        />

        {/* Temperature Converter Page */}
        <Route 
          path="/temperature" 
          element={
            <MainLayout>
              <Temperature />
            </MainLayout>
          } 
        />
        
        {/* Minifier Page */}
        <Route 
          path="/minifier" 
          element={
            <MainLayout>
              <Minifier />
            </MainLayout>
          } 
        />
        
        {/* Unminifier Page */}
        <Route 
          path="/unminifier" 
          element={
            <MainLayout>
              <Unminifier />
            </MainLayout>
          } 
        />

        {/* Calculator Page */}
        <Route 
          path="/calculator" 
          element={
            <MainLayout>
              <Calculator />
            </MainLayout>
          } 
        />
        
        {/* Route for handling 404 Not Found */}
        <Route 
          path="*" 
          element={
            <MainLayout>
              <NotFound />
            </MainLayout>
          } 
        /> 
        
        {/* Note: This route will never be reached because of the catch-all route above */}
        {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
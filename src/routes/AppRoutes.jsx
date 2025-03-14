// src/routes/AppRoutes.jsx
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { path } from 'framer-motion/client';
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
import PasswordGenerator from '../pages/PasswordGenerator';
import Favicon from '../pages/Favicon';
import Currency from '../pages/Currency';
import ImageHexColor from '../pages/ImageHexColor';
import TermsOfService from '../pages/TermsOfService';
import PrivacyPolicy from '../pages/PrivacyPolicy';
import TextCaseConverter from '../pages/TextCaseConverter';
import CSVConverter from '../pages/CsvTable';

// Layout wrapper component that includes navbar and footer
const MainLayout = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to the top instantly on route change and reload the page so the animations work correctly and the user sees top->bottom not bottom->top
    window.scrollTo(0, 0);
    path.pathname
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

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

        {/* Terms Of Service Page */}
        <Route
          path="/terms-of-service"
          element={
            <MainLayout>
              <TermsOfService />
            </MainLayout>
          }
        />

        {/* Privacy Policy Page */}
        <Route
          path="/privacy-policy"
          element={
            <MainLayout>
              <PrivacyPolicy />
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

        {/* Currency Converter Page */}
        <Route
          path="/currency"
          element={
            <MainLayout>
              <Currency />
            </MainLayout>
          }
        />


        {/* Favicon Converter Page */}
        <Route
          path="/favicon"
          element={
            <MainLayout>
              <Favicon />
            </MainLayout>
          }
        />

        {/* Favicon Converter Page */}
        <Route
          path="/text-case"
          element={
            <MainLayout>
              <TextCaseConverter />
            </MainLayout>
          }
        />

        {/* Csv to Table Converter Page */}
        <Route
          path="/csv-to-table"
          element={
            <MainLayout>
              <CSVConverter />
            </MainLayout>
          }
        />

        {/* Currency Converter Page */}
        <Route
          path="/image-color-picker"
          element={
            <MainLayout>
              <ImageHexColor />
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

        {/* Random Password Generator Page */}
        <Route
          path="/password-generator"
          element={
            <MainLayout>
              <PasswordGenerator />
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

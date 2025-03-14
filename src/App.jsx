// src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes';

// App component is now primarily responsible for initializing the router and any global context providers or configurations
function App() {
  return (
    <AppRoutes />
  );
}

export default App;
// src/App.jsx
import React from 'react';
import AppRoutes from './routes/AppRoutes';

// App component is now primarily responsible for initializing the router and any global context providers or configurations
function App() {
  return (
    // You could wrap AppRoutes with context providers here
    // <SomeContextProvider>
    //   <AnotherContextProvider>
    <AppRoutes />
    //   </AnotherContextProvider>
    // </SomeContextProvider>
  );
}

export default App;
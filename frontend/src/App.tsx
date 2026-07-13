import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes/AppRoutes';

/**
 * Root Application component.
 * Attaches the RouterProvider configuring app routes.
 */
function App() {
  return <RouterProvider router={router} />;
}

export default App;

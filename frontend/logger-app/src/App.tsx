import { createBrowserRouter, RouterProvider } from 'react-router';
import { AuthProvider } from './Logger/api/AuthContext.tsx';

import AppLayout from './AppLayout.tsx';
import LoginPage from './Logger/pages/LoginPage.tsx';

import ProjectList from './Logger/pages/ProjectList.tsx';
import ProjectDetail from './Logger/pages/ProjectDetail.tsx';
import ErrorPage from './Logger/pages/ErrorPage.tsx';
import NotFoundPage from './Logger/pages/NotFoundPage.tsx';

import 'destyle.css';
import './index.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <ProjectList />},
      { path: "/projects/:id/", element: <ProjectDetail />},
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    path: "/login", 
    element: <LoginPage />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}
export default App
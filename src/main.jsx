import React from "react";
import ReactDOM from 'react-dom/client';
import LandingPage from "./components/LandingPage.jsx";
import MainPage from "./components/MainPage.jsx";
import './index.css';
import { createBrowserRouter } from "react-router-dom";
import { RouterProvider } from "react-router";

const router = createBrowserRouter ([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/lembrancas',
    element: <MainPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
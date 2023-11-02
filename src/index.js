import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import Protected from './components/Proteced';
import Login from './pages/Login';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Navbar from './components/Navbar';
import AddEditUser from './pages/AddEditUser';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
    <Route path="signup" element={<Signup />} />
    <Route path="login" element={<Login />} />
    <Route path="/" element={<Protected />} >
      <Route path="/" index element={<Home />} />
      <Route path="/add" index element={<AddEditUser />} />
    </Route>
  </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <RouterProvider router={router} />
);
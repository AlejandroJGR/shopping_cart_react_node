import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import NavBar from './components/NavBar';
import Cart from './components/Cart';
import Home from './components/Home';
import NotFound from './components/NotFound';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import CheckoutSuccess from './components/checkoutSuccess';
import Dashboard from './components/admin/Dashboard';
import Products from './components/admin/Products';
import Summary from './components/admin/Summary';
import CreateProduct from './components/admin/CreateProduct';
import ProductsList from './components/admin/list/ProductsList';
import Users from './components/admin/Users';
import Orders from './components/admin/Orders';
import Product from './components/Details/Product';
import Order from './components/Details/Order';
import UserProfile from './components/Details/UserProfile';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <ToastContainer />
        <NavBar />
        <div className='content-container'>
          <Routes>
            <Route path='/cart' element={<Cart />} />
            <Route path="/register" element={<Register />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/order/:id" element={<Order />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/admin" element={<Dashboard />}>
              <Route path="products" element={<Products />}>
                <Route index element={<ProductsList />} />
                <Route path="create-product" element={<CreateProduct />} />
              </Route>
              <Route path="summary" element={<Summary />} />
              <Route path="users" element={<Users />} />
              <Route path="orders" element={<Orders />} />
            </Route>
            <Route path='/not-found' element={<NotFound />} />
            <Route path='/' element={<App />} />
            <Route index element={<Home />} />
            <Route path='*' element={<Navigate replace to="/not-found" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;




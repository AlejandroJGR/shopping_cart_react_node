import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {ToastContainer} from "react-toastify";

import NavBar from './components/NavBar';
import Cart from './components/Cart';
import Home from './components/Home';
import NotFound from './components/NotFound';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <ToastContainer/>
        <NavBar/>
        <Routes>
          <Route path='/cart' element={<Cart/>} />
          <Route path='/not-found' element={<NotFound />} /> 
          <Route path='/' element={<App/>} />
          <Route index element={<Home/>} />    
          <Route path='*' element={<Navigate replace to="/not-found" />} />     
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;




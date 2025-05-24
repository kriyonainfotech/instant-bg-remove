
import React from 'react'
import {BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from './components/HomePage';
import Home from './components/Home';

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/home' element={<HomePage />}/>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
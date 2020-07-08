import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './App.css';
import Thread from './components/Thread';
import Popup from './components/Popup';
import Board from './components/Board';

function App() {   
  
  return (
    <div className="container">
      <h1 className="title">Message Board</h1>
      <Board />
    </div>
  );
}

export default App;

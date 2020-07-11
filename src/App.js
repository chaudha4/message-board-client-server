import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './App.css';
import Board from './components/Board';
import SplashScreen from './components/SplashScreen';


function App() {   
  
  const [loading, setLoading] = useState(true);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect( () => {
    setTimeout( () => {
      setLoading(false);
    }, 100);
  });

  const renderMe = (e) => {
    if (loading) {
      return <SplashScreen />;
    }

    return (
      <div className="container">
        <h1 className="title">Message Board</h1>
        <Board />
      </div>
    );
  }

  return renderMe();
}

export default App;

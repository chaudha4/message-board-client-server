import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './App.css';
import Threads from './components/Threads';

function App() {

  const [query, setQuery] = useState('');

  const [boards, setBoards] = useState([]);

  const getBoard = async (e) => {

    e.preventDefault();

    // Assumption is that the server is ruuing at the same domain as client.
    //const url = window.location.href + `b/${query}/`;

    const url = `https://chaudha4-mesgboard-mongo.glitch.me/api/threads/${query}/`
    
    console.log("Accessing URL %s", url);

    try {
      const res = await fetch(url);
      console.log(res);
      const data = await res.json();
      console.log(data);
      setBoards(data);
    } catch (err) {
      console.error(err);
    }
  }
  
  
  
  return (
    <div className="container">
      <h1 className="title">Message Board</h1>
      {/* Refer to https://scrimba.com/p/pZaznUL/cE9N3nsw */}

      <form className="form" onSubmit={getBoard}>
        {/* htmlFor attribute specifies which form element a label is bound to. */}
  {/*<label className="label" htmlFor="query">board</label>*/}
        <input className="input" type="text" name="query"
          placeholder="board name"
          value={query} onChange={(e) => setQuery(e.target.value)}
        />    
        <button className="button" type="submit">Get</button>
      </form>

      <div className="card-list">
        {boards.map(b => (
            <Threads key={b._id} board={b}/>
        ))}
      </div>

    </div>
  );
}

export default App;

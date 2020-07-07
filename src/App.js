import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './App.css';

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
          <div className="card" key={b._id}>
            <h2 className="card--title">
              {b.board} - thread "{b.text}"
            </h2>
            <p><b>Created On: </b>{b.created_on}</p>
            <p><b>Last Updated: </b>{b.bumped_on}</p>
            <p><b>Id: </b>{b.thread_id}</p>
            <p><b>Replies: </b>{b.reply.length}</p>
            {b.reply.map(reply => (
              <p key={reply._id}>{reply.reply}</p>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}

export default App;
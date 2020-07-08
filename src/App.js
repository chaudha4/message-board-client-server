import React from 'react';
import { useState, useRef, useEffect } from 'react';
import './App.css';
import Thread from './components/Thread';
import Popup from './components/Popup';

function App() {

  const [query, setQuery] = useState('');

  const [popup, setPopup] = useState({visible: false, mesg: null});

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
  
  const createBoard = async (e) => {
    console.log("CreateBoard");
    console.log(query);

    const url = `https://chaudha4-mesgboard-mongo.glitch.me/api/threads/${query}/`

    try {
      // POST /api/threads/:board
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          board: query
        }),
      });
      console.log(res);
      const data = await res.json();
      console.log(data);
      setBoards(data);
    } catch (err) {
      //console.error(err);
    }    
  }
  
  const deleteBoard = async (e) => {
    console.log("deleteBoard");
    console.log(query);

    const url = `https://chaudha4-mesgboard-mongo.glitch.me/api/threads/${query}/`

    try {
      // POST /api/threads/:board
      const res = await fetch(url, {
        method: 'DELETE',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({
          board: query
        }),
      });
      console.log(res);
      const data = await res.json();
      console.log(data);
      setBoards({});
      setPopup({visible: true, mesg: "Delete Successful for " + query});
    } catch (err) {
      setPopup({visible: true, mesg: "Delete Failed for " + query});      
      console.error(err);
    }    
  }

  // Will be called from the Popup component.
  const hidePopupCB = () => {
    console.log("Toggling Popup visible-", popup);
    //setPopup({visible: !popup.visible, mesg: "Testing a new message"});
    setPopup({visible: !popup.visible});
  }


  const testPopup = () => {
    console.log("Testing Popup visible-", popup);
    setPopup({visible: !popup.visible, mesg: "Testing a new message"});
  }
    
  
  return (
    <div className="container">

      <h1 className="title">Message Board</h1>

      {/* Refer to https://scrimba.com/p/pZaznUL/cE9N3nsw */}

      <form className="form" onSubmit={getBoard}>
        {/* htmlFor attribute specifies which form element a label is bound to. */}
        <label className="label" htmlFor="query">Board Name:</label>
        <input className="input" type="text" name="query"
          placeholder="Please enter board name"
          value={query} onChange={(e) => setQuery(e.target.value)}
        />

        {/* Manage popup dialog */}
        {popup.visible ? <Popup hidePopup={hidePopupCB} mesg={popup.mesg} /> : null}
        <button className="button" type="button"
          onClick={testPopup}>Test Popup</button>
      </form>

      <br></br>
      <button className="button" type="submit">Get</button>
      <button className="button" type="button"
        onClick={createBoard}>Create</button>
      <button className="button" type="button"
        onClick={deleteBoard}>Delete</button>

      <div className="card-list">
        {boards.map(b => (
          <Thread key={b._id} board={b} />
        ))}
      </div>

    </div>
  );
}

export default App;

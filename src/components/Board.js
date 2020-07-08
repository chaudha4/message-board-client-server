import React from 'react';
import { useState } from 'react';
import Thread from './Thread';
import Popup from './Popup';
import {getBoardApi, createBoardApi} from '../api/BoardApi';

export default function Board(props) {

  const [query, setQuery] = useState('');

  const [popup, setPopup] = useState({visible: false, mesg: null});

  const [boards, setBoards] = useState([]);
  
  const getBoard = async (e) => {
    e.preventDefault();
    const data = await getBoardApi(query);
    if (data && data.length > 0) {
        setBoards(data);
    } else {
        setPopup({visible: true, mesg: "Get Failed for " + query});
    } 
  }

  const createBoard = async (e) => {
    e.preventDefault();
    const data = await createBoardApi(query);
    if (data) {
        setBoards(data);
    } else {
        setPopup({visible: true, mesg: "Create Failed for " + query});
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
    <div>
        <form className="form" onSubmit={getBoard}>
            {/* htmlFor attribute specifies which form element a label is bound to. */}
            <label className="label" htmlFor="query">Board Name:</label>
            <input className="input" type="text" name="query"
                placeholder="Please enter board name"
                value={query} onChange={(e) => setQuery(e.target.value)}
            />
            <button className="button" type="submit">Get</button>
        </form>

        <br></br>
        
        
        <button className="button" type="button"
            onClick={createBoard}>Create</button>
        <button className="button" type="button"
            onClick={deleteBoard}>Delete</button>

        {/* Manage popup dialog */}
        {popup.visible ? <Popup hidePopup={hidePopupCB} mesg={popup.mesg} /> : null}
        <button className="button" type="button"
            onClick={testPopup}>Test Popup</button>

        <div className="card-list">
            {boards.map(b => (
                <Thread key={b._id} board={b} />
            ))}
        </div>

    </div>
  );
}


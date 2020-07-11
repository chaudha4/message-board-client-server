import React from 'react';
import { useState } from 'react';
import Thread from './Thread';
import Popup from './Popup';
import {getBoardApi, createBoardApi, deleteBoardApi} from '../api/BoardApi';
import SplashScreen from './SplashScreen';

export default function Board(props) {

  const [query, setQuery] = useState('');

  const [popup, setPopup] = useState({visible: false, mesg: null});

  const [boards, setBoards] = useState([]);

  const [loading, setLoading] = useState(false);
  
  const getBoard = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await getBoardApi(query);
    setLoading(false);
    if (data && data.length > 0) {
        setBoards(data);
    } else {
        setPopup({visible: true, mesg: "Get Failed for " + query});
        setBoards([]);
    } 
  }

  const createBoard = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await createBoardApi(query);
    setLoading(false);
    if (data) {
        setBoards(data);
    } else {
        setPopup({visible: true, mesg: "Create Failed for " + query});
        setBoards([]);
    }
  }
  
  const deleteBoard = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await deleteBoardApi(query);
    setLoading(false);
    if (data) {
        setBoards([]);
    } else {
        setPopup({visible: true, mesg: "Delete Failed for " + query});
        setBoards([]);
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

  const renderMe = () => {
    if (loading) {
      return <SplashScreen />;
    }

    return (
      <div>
          <form className="form" onSubmit={getBoard}>
              {/* htmlFor attribute specifies which form element a label is bound to. */}
              <label className="label" htmlFor="query">Board Name:</label>
              <input type="text" name="query"
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
    
  return renderMe();
}


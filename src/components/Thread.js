import React, {useState} from "react";
import Reply from './Reply';
import {reportThreadApi, updateThreadTextApi} from '../api/ThreadApi';
import {createReplyApi} from '../api/ReplyApi';
import SplashScreen from './SplashScreen';

export default function Thread({board}) {

  //console.log("Entering Threads with argument %o", board);

  // Let react manage this so that checkbox can refresh when repData changes
  const [repData, setReported] = useState(board.reported);
  const [threadText, setThreadText] = useState(board.text);

  // Let react manage this so that Relies can refresh when new reply is added
  const [boardData, setBoardData] = useState(board);

  const [newReply, setNewReply] = useState('');

  // Showing loading during API calls.
  const [loading, setLoading] = useState(false);  

  const reportThread = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await reportThreadApi(board);
    setLoading(false);
    console.log("reportThread: Received Thread data %o", data);
    setReported(data.reported);
  }
  
  const addNewReply = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await createReplyApi(board, newReply);
    setLoading(false);
    console.log("Thread::addNewReply Received data %o", data);
    setNewReply("");  // Clear the text
    setBoardData(data); // Update the board with new data.
  }
  
  const updateThreadText = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = await updateThreadTextApi(board, threadText);
    setLoading(false);
    console.log("Thread::updateThreadText Received data %o", null);
    setThreadText(threadText); // Update the board with new data.
  }
  
  const renderMe = () => {
    if (loading) {
      return <SplashScreen />;
    }

    return (
      <div className="card">
        <h2 className="card--title">
          {board.board}<p>{threadText}</p>
          </h2>
  
          {/* Thread text */}
          <form className="form" onSubmit={updateThreadText}>
              <input className="input" type="text"
                  value={threadText} 
                  onChange={(e) => setThreadText(e.target.value)}
              />
              <button className="button" type="submit">Update</button>
        </form>
  
        
        <p><b>Created On: </b>{board.created_on}</p>
        <p><b>Last Updated: </b>{board.bumped_on}</p>
        <p><b>Thread Id: </b>{board.thread_id}</p>
        <p><b>Reported: </b>{repData ? "Yes" : "No"}</p>
     
        <p>
          Report Thread <input type="checkbox"
            value={board.thread_id}
            checked={repData}
            onChange={reportThread} />
        </p>
  
        <p><b>Replies: </b>{board.reply.length}</p>
  
        <form className="form" onSubmit={addNewReply}>
              <input className="input" type="text"
                  placeholder="Add a new Reply"
                  value={newReply} 
                  onChange={(e) => setNewReply(e.target.value)}
              />
              <button className="button" type="submit">Reply</button>
        </form>
   
        {boardData.reply.map(element => (
          <Reply key={element._id}
            boardData={boardData}
            replyData={element}
          />
        ))}

      </div>
  
  
    );      

  } //renderme

  return renderMe();
} //Threads

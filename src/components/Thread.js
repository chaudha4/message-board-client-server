import React, {useState} from "react";
import Reply from './Reply';
import {reportThreadApi} from '../api/ThreadApi';
import {createReplyApi} from '../api/ReplyApi';

export default function Thread({board}) {

  console.log("Entering Threads with argument %o", board);

  const [repData, setReported] = useState(board.reported);

  const [newReply, setNewReply] = useState('');

  const reportThread = async (e) => {
    e.preventDefault();
    const data = await reportThreadApi(board);
    console.log("reportThread: Received Thread data %o", data);
    setReported(data.reported);
  }
  
  const addNewReply = async (e) => {
    e.preventDefault();
    const data = await createReplyApi(board, newReply);
    console.log("addNewReply: Received Thread data %o", data);
    setNewReply("");
    /*
    const data = await getBoardApi(query);
    if (data && data.length > 0) {
        setBoards(data);
    } else {
        setPopup({visible: true, mesg: "Get Failed for " + query});
        setBoards([]);
    } 
    */
  }  
      
  return (
    <div className="card">
      <h2 className="card--title">
        {board.board} - thread "{board.text}"
        </h2>
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

      {board.reply.map(element => (
        <Reply key={element._id} boardData={board}
        replyData={element}
        />
      ))}

    </div>


  );      
      

} //Threads

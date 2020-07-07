import React, {useState} from "react";

export default function Replies({board}) {

    console.log("Entering Replies with argument %o", board);

    const reportReply = async (e) => {

        //e.preventDefault();
    
        // Assumption is that the server is running at the same domain as client.
        //const url = window.location.href + `b/${query}/`;
    
        const url = `https://chaudha4-mesgboard-mongo.glitch.me/api/replies/${board}/`
        
    
        // Since value can only be a string, we stringfy the
        // value before sending to so that we can transmit a structure.
        const ids = JSON.parse(e.target.value);
        console.log(ids);
        
        try {
          const res = await fetch(url, {
            method: 'PUT',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({
              board: board.board, 
              thread_id: ids.a,
              reply_id: ids.b
            }),        
          })
          console.log(res);
          const data = await res.json();
          console.log(data);
          //setBoards(data);
        } catch (err) {
          console.error(err);
        }
    
      }     

    return (
        <div>
            <p><b>Replies: </b>{board.reply.length}</p>
            {board.reply.map(reply => (
                <div className="card--reply" key={reply._id}>
                    <p>{reply.reply}</p>
                    <p>Reply Id: {reply._id}</p>
                    <p>
                        Report Reply <input type="checkbox"
                            checked={reply.reported}
                            value={JSON.stringify({ 'a': board.thread_id, 'b': reply._id })}
                            onChange={reportReply} />
                    </p>
                </div>
            ))}
        </div>
    ); //return


} //Replies
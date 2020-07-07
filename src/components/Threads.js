import React, {useState} from "react";
import Replies from './Replies';

export default function Threads({board}) {

    console.log("Entering Threads with argument %o", board);

    const [reported, setReported] = useState(board.reported);    

    const reportThread = async (e) => {

        //e.preventDefault();
    
        // Assumption is that the server is ruuing at the same domain as client.
        //const url = window.location.href + `b/${query}/`;
    
        const url = `https://chaudha4-mesgboard-mongo.glitch.me/api/threads/${board}/`
        
        console.log("Accessing URL %s Value-%s", url, e.target.value);
        
        try {
          const res = await fetch(url, {
            method: 'PUT',
            headers: {'Content-type': 'application/json; charset=UTF-8'},
            body: JSON.stringify({board: board.board, thread_id: e.target.value}),        
          })
          console.log(res);
          const data = await res.json();
          console.log(data);
          setReported(false); //toggle
        } catch (err) {
          console.error(err);
        }
    
      }  
      
      return (
              <div className="card">
                <h2 className="card--title">
                  {board.board} - thread "{board.text}"
                </h2>
                <p><b>Created On: </b>{board.created_on}</p>
                <p><b>Last Updated: </b>{board.bumped_on}</p>
                <p><b>Thread Id: </b>{board.thread_id}</p>
                <p>
                  Report Thread <input type="checkbox"
                    value={board.thread_id}
                    checked={reported}
                    onChange={reportThread} />
                </p>
    
                <Replies board={board}/>
        
              </div>
            

      );      
      

} //Threads

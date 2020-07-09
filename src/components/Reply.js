import React, {useState} from "react";
import {reportReplyApi, deleteReplyApi} from "../api/ReplyApi";

//export default function Reply(props) {
export default function Reply({boardData, replyData}) {

    //console.log("Entering Replies with argument %o", boardData);   

    const [repData, setReported] = useState(replyData.reported);
    const [repText, setRepText] = useState(replyData.reply);

    const reportThread = async (e) => {
        e.preventDefault();
        const data = await reportReplyApi(
            boardData.board,
            boardData.thread_id,
            replyData);
            
        console.log("Reply::reportThread: Received data %o", data);
        setReported(true);
      }    

    const deleteReply = async (e) => {
        e.preventDefault();
        const data = await deleteReplyApi(boardData, replyData);
        setRepText("[deleted......]")
        return data;
    }

    return (
        <div className="card--reply" >
            <p>{repText}</p>
            <p>Reply Id: {replyData._id}</p>
            <p>
                Report Reply < input type="checkbox"
                    checked={repData}
                    onChange={reportThread}
                />
            </p>
            <button className="button" type="button"
                onClick={deleteReply}>Delete</button>
        </div>


    ); //return


} //Replies
import React, {useState} from "react";
import {reportReplyApi} from "../api/ReplyApi";

//export default function Reply(props) {
export default function Reply({boardData, replyData}) {

    console.log("Entering Replies with argument %o", boardData);   

    return (
        <div className="card--reply" >
            <p>{replyData.reply ? replyData.reply : "Empty Reply Text"}</p>
            <p>Reply Id: {replyData._id}</p>
            <p>
                Report Reply <input type="checkbox"
                    checked={replyData.reported}
                    onChange={(e) => reportReplyApi(boardData.board, boardData.thread_id, replyData)} />
            </p>
        </div>


    ); //return


} //Replies
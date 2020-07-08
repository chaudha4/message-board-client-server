import React, {useState} from "react";
import {reportReply} from "../api/ReplyApi";

//export default function Reply(props) {
export default function Reply({boardName, threadId, reply}) {

    console.log("Entering Replies with argument %o", boardName);   

    return (
        <div className="card--reply" >
            <p>{reply.reply}</p>
            <p>Reply Id: {reply._id}</p>
            <p>
                Report Reply <input type="checkbox"
                    checked={reply.reported}
                    value={JSON.stringify({ 'a': threadId, 'b': reply._id })}
                    onChange={(e) => reportReply(boardName, threadId, reply)} />
            </p>
        </div>


    ); //return


} //Replies
import React, {useState} from "react";
import {reportReplyApi, deleteReplyApi} from "../api/ReplyApi";
import SplashScreen from './SplashScreen';

//export default function Reply(props) {
export default function Reply({boardData, replyData}) {

    //console.log("Entering Replies with argument %o", boardData);   

    const [repData, setReported] = useState(replyData.reported);
    const [repText, setRepText] = useState(replyData.reply);

    // Showing loading during API calls.
    const [loading, setLoading] = useState(false);      

    const reportThread = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = await reportReplyApi(
            boardData.board,
            boardData.thread_id,
            replyData);
        setLoading(false);
        console.log("Reply::reportThread: Received data %o", data);
        setReported(true);
      }    

    const deleteReply = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = await deleteReplyApi(boardData, replyData);
        setLoading(false);
        setRepText("[deleted......]")
        return data;
    }

    const renderMe = () => {
        if (loading) {
          return <SplashScreen />;
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
        );

    } //renderme

    return renderMe();

} //Replies
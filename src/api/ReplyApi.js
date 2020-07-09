import {getThreadApi} from './ThreadApi';
import {BASE_URL} from "./global";

async function reportReplyApi(boardName, threadId, replyInstance) {

    // Assumption is that the server is running at the same domain as client.
    //const url = window.location.href + `b/${query}/`;

    const url = `${BASE_URL}api/replies/${boardName}/`

    console.log("reportReply - ", boardName, threadId, replyInstance._id);

    try {
        const res = await fetch(url, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                board: boardName,
                thread_id: threadId,
                reply_id: replyInstance._id
            }),
        })
        console.log("ReplyApi::createReplyApi Received Response- %o", res);

        const data = await getThreadApi(boardName, threadId);
        return data;
    } catch (err) {
        console.error("Failed to Update");
        throw(err);
    }

}


async function createReplyApi(boardData, replyText) {

    const url = `${BASE_URL}api/replies/${boardData.board}/`

    console.log("createReplyApi: Entered with %s - %o", replyText, boardData);

    try {
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                board: boardData.board,
                thread_id: boardData.thread_id,
                text: replyText,
                delete_password: "a"    // Hardcoded for now
            }),
        })
        console.log("createReplyApi: Received Response- %o", res);

        // Now get the updated board and return it;
        const data = await getThreadApi(boardData.board, boardData.thread_id);
        return data;
    } catch (err) {
        console.error("Failed to Update");
        throw(err);
    }

}

async function deleteReplyApi(boardData, replyData) {

    const url = `${BASE_URL}api/replies/${boardData.board}/`

    console.log("deleteReplyApi: Entered with %0 - %o", replyData, boardData);

    try {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                board: boardData.board,
                thread_id: boardData.thread_id,
                reply_id: replyData._id
            }),
        })
        console.log("deleteReplyApi: Received Response- %o", res);

        // Now get the updated board and return it;
        const data = await getThreadApi(boardData.board, boardData.thread_id);
        return data;
    } catch (err) {
        console.error("Failed to Update");
        throw(err);
    }

}

export {reportReplyApi, createReplyApi, deleteReplyApi};
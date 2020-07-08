

export async function reportReply(boardName, threadId, replyInstance) {

    // Assumption is that the server is running at the same domain as client.
    //const url = window.location.href + `b/${query}/`;

    const url = `https://chaudha4-mesgboard-mongo.glitch.me/api/replies/${boardName}/`

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
        console.log(res);
        const data = await res.json();
        console.log(data);
    } catch (err) {
        console.error("Failed to Update");
        throw(err);
    }

}
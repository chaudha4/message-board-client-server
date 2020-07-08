async function getBoardApi(boardName) {

    if (!boardName || boardName === "") {
        console.log("getBoardApi: Board name is empty");
        return;
    }
    const url = `https://chaudha4-mesgboard-mongo.glitch.me/api/threads/${boardName}/`

    console.log("Accessing URL %s", url);

    try {
        const res = await fetch(url);
        console.log("getBoardApi: Received Response ", res);
        const data = await res.json();
        console.log("getBoardApi: Returning ", data);
        return data;
    } catch (err) {
        console.error(err);
    }

} //getBoard

async function createBoardApi(boardName) {

    if (!boardName || boardName === "") {
        console.log("createBoardApi: Board name is empty");
        return;
    }

    const url = `https://chaudha4-mesgboard-mongo.glitch.me/api/threads/${boardName}/`

    try {
        // POST /api/threads/:board
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-type': 'application/json; charset=UTF-8' },
            body: JSON.stringify({
                board: boardName
            }),
        });
        console.log("createBoardApi: Received res ", res);
        //const data = await res.json();
        //console.log("createBoardApi: Returning ", data);
        return getBoardApi(boardName);
        //return data;
    } catch (err) {
        console.error(err);
    }
} //createBoardApi

export { getBoardApi, createBoardApi };

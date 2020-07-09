import {getBoardApi} from './BoardApi';

async function reportThreadApi(boardData) {

    console.log("reportThreadApi argument: %o", boardData);

    const url = `https://chaudha4-mesgboard-mongo.glitch.me/api/threads/${boardData.board}/`
           
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {'Content-type': 'application/json; charset=UTF-8'},
        body: JSON.stringify({board: boardData.board, thread_id: boardData.thread_id}),        
      })
      console.log("reportThreadApi: Received res ", res);

      // Now get the BoardData that is being rendered by this component.
      //const data = await getThreadApi(boardData);
      //console.log("reportThreadApi: Returning data - %o", data);


      //Assuimg DB is updated, set reported to true !! Yes it is a hack !!
      boardData.reported = true;
      return boardData;

    } catch (err) {
      console.error(err);
    }    
    return [];

} //reportThreadApi

async function getThreadApi(boardData) {

    console.log("getThreadApi argument: %o", boardData);

    const data = await getBoardApi(boardData.board);

    data.forEach(element => {
        console.log("getThreadApi Processing Element: %o", element);
        if (element.thread_id == boardData.thread_id) {
            return element;
        }
    });

    return [];

} //reportThreadApi

export {reportThreadApi};
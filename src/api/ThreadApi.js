
import {BASE_URL} from "./global";

//const base_url = "https://chaudha4-mesgboard-mongo.glitch.me/";

async function updateThreadTextApi(boardData, newText) {

  let params = {
    boardName: boardData.board,
    thread_id: boardData.thread_id,
    text: newText
  };

  let urlQuery = Object.keys(params)
    .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    .join('&');

  let getUrl = `${BASE_URL}api/updateThreadText?${urlQuery}`;


  console.log("updateThreadTextApi argument: %s %o", getUrl, params);     

  try {
    const res = await fetch(getUrl);
    console.log("updateThreadTextApi: Received res %o", res);
    //const data = await res.json();
    //console.log("updateThreadTextApi: Returning %o", data);
    //return data;

  } catch (err) {
    console.error(err);
  }    


} //updateThreadTextApi

async function reportThreadApi(boardData) {

    console.log("reportThreadApi argument: %o", boardData);

    const url = `${BASE_URL}api/threads/${boardData.board}/`;
           
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

async function getThreadApi(boardName, threadId) {

    let params = {
      boardName: boardName,
      thread_id: threadId
    };

    let urlQuery = Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&');

    let getUrl = `${BASE_URL}api/getThread?${urlQuery}`;

    console.log("getThreadApi argument: %s %s %s", getUrl, boardName, threadId);    

    try {
      const res = await fetch(getUrl);
      console.log("reportThreadApi: Received res %o", res);
      const data = await res.json();
      console.log("reportThreadApi: Returning %o", data);
      return data;

    } catch (err) {
      console.error(err);
    }    

} //reportThreadApi

export {reportThreadApi, getThreadApi, updateThreadTextApi};
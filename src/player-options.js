import {parse as parseQueryString} from 'query-string';

export function createFromQueryString(queryString){
  let queryParams = getQueryParams(queryString);

  let options = {
    fullUrl:queryParams.fullUrl,
    videoID:parseVideoID(queryParams),
    playlistID: queryParams.list,
    startTime: parseStartTime(queryParams),
    captionsEnabled: queryParams.captionsEnabled,
  }
  return options
}

function getQueryParams(queryString){
  return queryString
    .split('?')
    .filter(string=>string)
    .map( string => parseQueryString(string,{parseNumbers:true,parseBooleans:true}) )
    .reduce((allParams, theseParams)=>{
      return Object.assign(allParams, theseParams);
    },{})
}

function parseVideoID({fullUrl,v}){
  let regex = /(?:be\/)([^\s\?&]+)/;
  let matches = regex.exec(fullUrl);
  if(matches){
    return matches[1];
  }
  return v;
}

function parseStartTime({t}){
  if(Number.isInteger(t)){
    return t;
  }
}
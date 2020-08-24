import {createFromQueryString} from 'youtube-proxy/src/player-options.js';

test('videoID is parsed correctly from a short url', ()=>{
  let queryString = '?fullUrl=https://youtu.be/kg12uhZu9_o';
  let options = createFromQueryString(queryString);

  expect(options.videoID)
    .toBe('kg12uhZu9_o');
});

test('videoID is parsed with a time query param', ()=>{
  let queryString = '?fullUrl=https://youtu.be/TCCJOTY7uRI?t=10';
  let options = createFromQueryString(queryString);

  expect(options.videoID)
    .toBe('TCCJOTY7uRI');
});

test('videoID is parsed with a time query param', ()=>{
  let queryString = '?fullUrl=https://youtu.be/TCCJOTY7uRI?t=10';
  let options = createFromQueryString(queryString);

  expect(options.videoID)
    .toBe('TCCJOTY7uRI');

  expect(options.startTime)
    .toBe(10)
});

test('video and playlistID is parsed correctly from browser watch url', ()=>{
  let queryString = '?fullUrl=https://www.youtube.com/watch?v=TCCJOTY7uRI&list=PL_90hJucBAcPmFxcbTea81OKGkQevH2F9&index=95&t=20';
  let options = createFromQueryString(queryString);

  expect(options.videoID)
    .toBe('TCCJOTY7uRI');

  expect(options.playlistID)
    .toBe('PL_90hJucBAcPmFxcbTea81OKGkQevH2F9');

  expect(options.startTime)
    .toBe(20)
});

test('playlistID is parsed correctly from a long url', ()=>{
  let queryString = '?fullUrl=https://www.youtube.com/playlist?list=PL_90hJucBAcPmFxcbTea81OKGkQevH2F9';
  let options = createFromQueryString(queryString);

  expect(options.playlistID)
    .toBe('PL_90hJucBAcPmFxcbTea81OKGkQevH2F9');
});

test('options are parsed correctly from a long with other query params', ()=>{
  let queryString = '?fullUrl=https://www.youtube.com/watch?v=TCCJOTY7uRI&list=PL_90hJucBAcPmFxcbTea81OKGkQevH2F9&index=95&t=0s';
  let options = createFromQueryString(queryString);

  expect(options.playlistID)
    .toBe('PL_90hJucBAcPmFxcbTea81OKGkQevH2F9');

  expect(options.startTime)
    .toBeUndefined();
});

test('it gets captionsEnabled from a simple url', ()=>{
  let queryString = '?fullUrl=https://youtu.be/kg12uhZu9_o&captionsEnabled=true';
  let options = createFromQueryString(queryString);

  expect(options.captionsEnabled)
    .toBe(true);
});

test('captionsEnabled is parsed correctly from the front of a long with other query params', ()=>{
  let queryString = '?captionsEnabled=true&fullUrl=https://www.youtube.com/watch?v=TCCJOTY7uRI&list=PL_90hJucBAcPmFxcbTea81OKGkQevH2F9&index=95&t=0s';
  let options = createFromQueryString(queryString);

    expect(options.captionsEnabled)
    .toBe(true);
});


test('captionsEnabled is parsed correctly from the front of a long with other query params', ()=>{
  let queryString = '?fullUrl=https://www.youtube.com/watch?v=TCCJOTY7uRI&list=PL_90hJucBAcPmFxcbTea81OKGkQevH2F9&index=95&t=0s&captionsEnabled=true';
  let options = createFromQueryString(queryString);

  expect(options.captionsEnabled)
    .toBe(true);
});
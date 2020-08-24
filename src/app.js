import './app.css';
import './youtube-player.css';
import YouTubePlayer from './youtube-player.js';
import {createFromQueryString} from './player-options.js'

// queryParam examples
// fullUrl=https://youtu.be/kg12uhZu9_o&captionsEnabled=true
// fullUrl=https://youtu.be/TCCJOTY7uRI?t=10
// fullUrl=https://www.youtube.com/playlist?list=PL_90hJucBAcPmFxcbTea81OKGkQevH2F9
// fullUrl=https://www.youtube.com/watch?v=TCCJOTY7uRI&list=PL_90hJucBAcPmFxcbTea81OKGkQevH2F9&index=95&t=7
// fullUrl=https://youtu.be/notAVideoDude
// fullUrl%3Dhttps%3A%2F%2Fwww.youtube.com%2Fwatch%3Fv%3DTCCJOTY7uRI%26list%3DPL_90hJucBAcPmFxcbTea81OKGkQevH2F9%26index%3D95%26t%3D7

let options = createFromQueryString(decodeURIComponent(location.search));
let player = new YouTubePlayer();
player.init(options);

window.addEventListener('message',({data})=>{
  if(data === 'play'){
    player.play();
  }
  if(data === 'pause'){
    player.pause();
  }
});
import EventHandler from './event-handler.js';

export default class YouTubePlayer {
  constructor(){
    this.eventHandler = new EventHandler(this);
  };

  playerID;
  playlistID;
  startTime;
  captionsEnabled;

  async init(options){
    Object.assign(this, options);
    await this.loadYouTube();
    let player = await this.createPlayer();
    this.player = player;
  }

  loadYouTube(){
    return new Promise((resolve) => {
      let previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (previous) {
          previous();
        }
        resolve(window.YT);
      };

      if (window.YT && window.YT.loaded) {
        resolve(window.YT);
      } else {
        let ytScript = document.createElement("script");
        ytScript.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(ytScript);
      }
    });
  };

  createPlayer(){
    return new Promise((resolve, reject)=>{
      let container = document.createElement('div');
      container.classList.add('you-tube-container');
      document.body.appendChild(container);

      let player = new YT.Player(container,{
        videoId: this.videoID,
        width:'100%',
        height:'100%',
        playerVars: this.playerVars,
        events:{
          onReady(){
            player.playVideo();
            resolve(player);
          },
          onStateChange: this.playerStateChange.bind(this),
          onError: this.playerError.bind(this),
        }
      })
    })
  };

  get playerVars(){
    let {captionsEnabled} = this;
    let playlistId = this.playlistID;
    let playerVars = {
      origin: window.origin,
      autoplay: 0,
      showinfo: 0,
      controls: 0,
      fs: 0,
      iv_load_policy: 3,
      modestbranding: 1,
      rel: 0,
      loop: 0,
      start: this.startTime || 0,
      widget_referrer: window.origin
    }
    if(playlistId){
      playerVars.listType = 'playlist';
      playerVars.list = playlistId;
    }
    if(captionsEnabled){
      playerVars.cc_load_policy = 1;
      playerVars.cc_lang_pref = "en";
    }

    return playerVars;
  };

  playerStateChange({data}){
    let stateNames = {
      '-1': 'ready',
      0: 'ended',
      1: 'playing',
      2: 'paused',
      3: 'buffering',
      5: 'queued'
    };

    this.eventHandler
      .handle(stateNames[data])
  };

  playerError(error){
    this.eventHandler
      .error(error)
  };

  get isLastVideo(){
    let index = this.player.getPlaylistIndex();
    let playlist = this.player.getPlaylist();

    if(index === -1){
      return true;
    }

    return index === playlist.length - 1;
  }

  play(){
    if(this.playlistID && !this.videoID){
      this.player.playVideoAt(0)
    } else {
      this.player.playVideo();
    }
    if(this.startTime){
      this.player.seekTo(this.startTime);
    }
  }

  pause(){
    this.player.pauseVideo();
  }

};

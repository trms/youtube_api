export default class EventHandler {
  constructor(player={}){
    this.player = player;
  };

  handle(status){
    let message = {
      fullUrl: this.player.fullUrl,
      reason: 'youtube-status',
      status,
    }
    if(status === 'ended' && this.player.isLastVideo === false){
      return;
    }
    this.sendMessage(message);
  };

  error(error){
    let message = {
      fullUrl: this.player.fullUrl,
      reason: 'youtube-status',
      status:'error',
      error,
      instructions:'send "play" or "pause" strings via postMessage back to control the video'
    }
    this.sendMessage(message);

  }

  sendMessage(message){
    window.parent.postMessage(message,'*');

    if(window.webkit && window.webkit.messageHandlers){
      window.webkit.messageHandlers.videoEvent.postMessage(message.status);
    }

    if(window.BSMessagePort){
      let bsMessage = new BSMessagePort();
      bsMessage.PostBSMessage(message)
    }
  }
}
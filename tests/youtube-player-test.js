import YouTubePlayer from 'youtube-proxy/src/youtube-player.js';
import EventHandler from 'youtube-proxy/src/event-handler.js';
jest.mock('youtube-proxy/src/event-handler.js');


beforeEach(() => {
  EventHandler.mockClear();
});

test('exists',() => {
  expect(new YouTubePlayer()).toBeDefined();
});

test('init sets options on the player',()=>{
  let options = {
    foo:'bar',
    bat:'baz',
  }
  let player = new YouTubePlayer();
  player.init(options);

  expect(player.foo).toBe('bar');
  expect(player.bat).toBe('baz');
});

test('init calls the player setup functions',async ()=>{
  let player = new YouTubePlayer();
  let loadSpy = jest.spyOn(player,'loadYouTube').mockImplementation(()=>{});
  let createSpy = jest.spyOn(player,'createPlayer').mockImplementation(()=>{});

  await player.init({videoID:'foo'});

  expect(loadSpy)
    .toHaveBeenCalled();

  expect(createSpy)
    .toHaveBeenCalled();
});


test('playerVars is created correctly', ()=>{
  let options = {
    videoID: 'foo',
    playlistID: 'bar',
    startTime: 10,
    captionsEnabled: true,
  }
  let player = new YouTubePlayer();
  player.init(options);

  expect(player.playerVars)
    .toStrictEqual(expect.objectContaining({
      listType:'playlist',
      list: options.playlistID,
      start: options.startTime,
      cc_load_policy: 1,
      cc_lang_pref:'en',
    }));

  player = new YouTubePlayer();
  expect(player.playerVars)
    .toStrictEqual(expect.not.objectContaining({
      listType:'playlist',
      list: options.playlistID,
      cc_load_policy: 1,
      cc_lang_pref:'en',
    }));

  expect(player.playerVars.start).toBe(0);
});

test('the play command will a play and seek on the youtube player for a video', ()=>{
  let player = new YouTubePlayer();
  player.init({videoID:'foo'});

  player.player = {
    playVideo: jest.fn(),
    seekTo: jest.fn(),
  }

  player.play();

  player.startTime = 10;
  player.play();

  expect(player.player.playVideo).toHaveBeenCalledTimes(2);
  expect(player.player.seekTo).toHaveBeenCalledTimes(1);
  expect(player.player.seekTo).toHaveBeenCalledWith(10);
})

test('the play command will a play and seek on the youtube player for a playlist', ()=>{
  let player = new YouTubePlayer();
  player.init({playlistID:'foo'})
  player.player = {
    playVideoAt: jest.fn(),
    seekTo: jest.fn(),
  }

  player.play();

  player.startTime = 15;
  player.play();

  expect(player.player.playVideoAt).toHaveBeenCalledTimes(2);
  expect(player.player.playVideoAt).toHaveBeenCalledWith(0);
  expect(player.player.seekTo).toHaveBeenCalledTimes(1);
  expect(player.player.seekTo).toHaveBeenCalledWith(15);
})

test('isLastVideo calls the player functions to determine its logic',()=>{
  let player = new YouTubePlayer();
  player.player = {
    getPlaylistIndex: jest.fn()
      .mockImplementationOnce(()=>-1)
      .mockImplementationOnce(()=>2)
      .mockImplementationOnce(()=>3),
    getPlaylist: jest.fn()
      .mockImplementation(()=>['foo','bar','bat','baz']),
  }

  expect(player.isLastVideo).toBe(true);
  expect(player.isLastVideo).toBe(false);
  expect(player.isLastVideo).toBe(true);
})

test('it calls the event handler for state changes',()=>{
  let player = new YouTubePlayer();

  player.playerStateChange({data:1});
  expect(EventHandler.mock.instances[0].handle)
    .toHaveBeenCalledWith('playing');

  player.playerStateChange({data:0});
  expect(EventHandler.mock.instances[0].handle)
    .toHaveBeenCalledWith('ended')
});


test('it calls the event handler for errors',()=>{
  let player = new YouTubePlayer();
  let error = {message:'something'};

  player.playerError(error);
  expect(EventHandler.mock.instances[0].error)
    .toHaveBeenCalledWith(error);
})

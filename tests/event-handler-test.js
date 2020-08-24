import EventHandler from 'youtube-proxy/src/event-handler.js';

test('exists',() => {
  expect(new EventHandler()).toBeDefined();
});

test('it handles the various youtube events',()=>{
  let handler = new EventHandler({fullUrl:'myUrl'});
  let spy = jest.spyOn(handler, 'sendMessage');

  handler.handle('ready');
  expect(spy)
    .toHaveBeenCalledWith(expect.objectContaining({status:'ready'}));

  handler.handle('playing');
  expect(spy)
    .toHaveBeenCalledWith(expect.objectContaining({status:'playing'}));

  handler.handle('ended');
  expect(spy)
    .toHaveBeenCalledWith(expect.objectContaining({status:'ended'}));

  expect(spy).toHaveBeenCalledTimes(3);
});

test('it handles an error',()=>{
  let handler = new EventHandler({fullUrl:'myUrl'});
  let spy = jest.spyOn(handler, 'sendMessage');
  let error = {data:'something'};

  handler.error(error);
  expect(spy)
    .toHaveBeenCalledWith(expect.objectContaining({error}));
});

test('it wont fire the ended event if the player isnt on its last video',()=>{
  let handler = new EventHandler({isLastVideo:false});
  let spy = jest.spyOn(handler, 'sendMessage');

  handler.handle('ended');
  expect(spy)
    .toHaveBeenCalledTimes(0);
});

test('it fires a window.postMessage event',()=>{
  let previous = window.postMessage;
  window.postMessage = jest.fn();

  let handler = new EventHandler({fullUrl:'thisUrl'});
  handler.handle('playing');

  expect(window.postMessage)
    .toHaveBeenCalledWith(
      expect.objectContaining({
        fullUrl: 'thisUrl',
        status: 'playing',
      }),
      "*"
    );

  window.postMessage = previous;
})

test('fires a BSMessagePort function if it exists',()=>{
  let PostBSMessage = jest.fn();
  let Mock = jest.fn()
    .mockImplementation(()=>{
      return {PostBSMessage:PostBSMessage}
    });

  window.BSMessagePort = Mock;

  let handler = new EventHandler({fullUrl:'someUrl'});
  handler.handle('ready');

  expect(PostBSMessage)
    .toHaveBeenCalledTimes(1);

    expect(PostBSMessage)
    .toHaveBeenCalledWith(
      expect.objectContaining({
        fullUrl: 'someUrl',
        status: 'ready',
        reason: 'youtube-status',
      })
    );

  delete window.BSMessagePort;
})

test('fires a webkit videoevent handler function if it exists',()=>{
  let postMessage = jest.fn();
  let webkit = {
    messageHandlers: {
      videoEvent:{
        postMessage
      }
    }
    }

  window.webkit = webkit;

  let handler = new EventHandler({fullUrl:'someUrl'});
  handler.handle('ready');

  expect(postMessage)
    .toHaveBeenCalledTimes(1);

  expect(postMessage)
    .toHaveBeenCalledWith('ready');

  delete window.webkit;
})

import VideoJs from "../component/VideoJs"
import React from 'react';

const Videotest = () => {
    const playerRef = React.useRef(null);

    const videoJsOptions = {
      autoplay: true,
      controls: true,
      responsive: true,
      fluid: true,
      sources: [{
        src: 'http://sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-480p.flv',
        type: 'video/x-flv'
      }]
    };
  
    const handlePlayerReady = (player) => {
      playerRef.current = player;
  
      // You can handle player events here, for example:
      player.on('waiting', () => {
        console.log('player is waiting');
      });
  
      player.on('dispose', () => {
        console.log('player will dispose');
      });
    };
  
    return (
      <>
        <div>Rest of app here</div>
        <VideoJs options={videoJsOptions} onReady={handlePlayerReady} />
        <div>Rest of app here</div>
      </>
    );
  }
  
  export default Videotest;
  
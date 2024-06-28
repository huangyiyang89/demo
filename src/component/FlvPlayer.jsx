// FlvPlayer.jsx
import { useEffect, useRef } from "react";
import flvjs from "flv.js";
import PropTypes from "prop-types";

const FlvPlayer = ({ url, isLive = false, onError }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let play_url = url;
    let play_type="flv";
    let play_live= isLive;
    if (flvjs.isSupported()) {
      if(url.includes("rtsp://")){
        play_url = "/api/stream/rtsp?url="+play_url;
        play_live = true
      }
      if(url.includes(".mp4")){
        play_type="mp4";
      }

      const flvPlayer = flvjs.createPlayer({
        type: play_type,
        url: play_url,
        isLive: play_live,
      });
      console.log("flvPlayer", flvPlayer);
      flvPlayer.on(flvjs.Events.ERROR,(errorType, errorDetail, errorInfo) => {
        console.log("errorType", errorType);
        console.log("errorDetail", errorDetail);
        console.log("errorInfo", errorInfo);
        // 视频出错后销毁重建
        
        flvPlayer.detachMediaElement();
    })


      flvPlayer.on(flvjs.Events.ERROR, (err) => {
        flvPlayer.detachMediaElement();
        onError(err)
        console.log("flvplayer error:",err)
      });


      if (play_url) {
        flvPlayer.attachMediaElement(videoRef.current);
        flvPlayer.load();
        flvPlayer.play();
      }

      return () => {
        flvPlayer.destroy();
      };
    }
  }, [url, isLive,onError]);

  return (
      <video ref={videoRef} controls style={{ height: "100%", width:"100%",top:0,left:0,position:"absolute",background:"black"}} />
  );
};

FlvPlayer.propTypes = {
  url: PropTypes.string.isRequired,
  isLive: PropTypes.bool,
  onError: PropTypes.func,
};
export default FlvPlayer;

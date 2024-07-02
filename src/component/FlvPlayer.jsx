// FlvPlayer.jsx
import { useEffect, useRef } from "react";
import flvjs from "flv.js";
import PropTypes from "prop-types";

const FlvPlayer = ({ camera = null ,url="", isLive = false, onError }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let play_url = url;
    let play_type="flv";
    let play_live= isLive;
    let hostname = window.location.hostname;
    let host = window.location.host;

    if (flvjs.isSupported()) {
      //服务器代理模式
      if(camera){
        play_url = `ws://${hostname}:8005/camera/${camera.Camera_id}.live.flv`
        play_type="flv";
        play_live = true;
      }
      //api代理模式
      else if(url.includes("rtsp://")){
        
        play_url = `ws://${host}/api/stream/rtspws?url=${url}`
        console.log(play_url);
        play_type="flv";
        play_live = true;
      //flv文件直接播放
      }else if(url.includes(".flv")){
        play_url = url;
        play_type="flv";
        play_live = false;
      }
      //其他
      else{
        play_url = url;
        play_type="mp4";
        play_live = false;
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
  }, [camera, url,isLive,onError]);

  return (
      <video ref={videoRef} controls disablePictureInPicture muted style={{ height: "100%", width:"100%",top:0,left:0,position:"absolute",background:"black"}} />
  );
};

FlvPlayer.propTypes = {
  camera:PropTypes.object,
  url: PropTypes.string,
  isLive: PropTypes.bool,
  onError: PropTypes.func,
};
export default FlvPlayer;

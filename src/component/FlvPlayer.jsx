// FlvPlayer.jsx
import { useEffect, useRef } from "react";
import flvjs from "flv.js";
import PropTypes from "prop-types";

const FlvPlayer = ({ url = "", isLive = false, onError }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    let play_url = url;
    let play_type = "flv";
    let play_live = isLive;

    if (flvjs.isSupported() && play_url != "") {
      if (url.includes(".mp4")) {
        play_type = "mp4";
        play_live = false;
      }

      const flvPlayer = flvjs.createPlayer({
        type: play_type,
        url: play_url,
        isLive: play_live,
      });

      flvPlayer.on(flvjs.Events.ERROR, (errorType, errorDetail, errorInfo) => {
        console.log("errorType", errorType);
        console.log("errorDetail", errorDetail);
        console.log("errorInfo", errorInfo);
        // 视频出错后销毁重建
        flvPlayer.detachMediaElement();
      });

      flvPlayer.on(flvjs.Events.ERROR, (err) => {
        flvPlayer.detachMediaElement();
        onError(err);
      });

      if (play_url) {
        flvPlayer.attachMediaElement(videoRef.current);
        flvPlayer.load();
        //flvPlayer.play();
      }

      return () => {
        if (!flvPlayer) return;
        try {
          flvPlayer.detachMediaElement();
          flvPlayer.destroy();
        } catch (error) {
          console.error("flvPlayer destroy error:");
        }
      };
    }
  }, [url, isLive, onError]);

  return (
    <video
      ref={videoRef}
      controls
      disablePictureInPicture
      muted
      style={{
        height: "100%",
        width: "100%",
        top: 0,
        left: 0,
        position: "absolute",
        background: "black",
      }}
    />
  );
};

FlvPlayer.propTypes = {
  camera: PropTypes.object,
  url: PropTypes.string,
  isLive: PropTypes.bool,
  onError: PropTypes.func,
};
export default FlvPlayer;

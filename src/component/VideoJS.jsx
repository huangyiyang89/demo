import { useEffect, useRef } from "react";
import videojs from "video.js";
import PropTypes from "prop-types";
import "video.js/dist/video-js.css";
import "videojs-flvjs-es6";

export const VideoJs = ({ src, options, onReady }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const defaultOptions = {
      autoplay: true,
      controls: true,
      fluid: true,
      aspectRatio: "16:9",
      flvjs: {
        mediaDataSource: {
          isLive: true,
          cors: true,
          withCredentials: false,
        },
      techOrder: ['html5', 'flvjs'],
    }
    };
    const combinedOptions = Object.assign({}, defaultOptions, options);

    if (!playerRef.current) {
      const videoElement = document.createElement("video-js");
      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current.appendChild(videoElement);

      const player = (playerRef.current = videojs(
        videoElement,
        combinedOptions,
        () => {
          videojs.log("player is ready");
          videojs.log(combinedOptions);
          onReady && onReady(player);
        }
      ));
    } else {
      const player = playerRef.current;
      player.autoplay(combinedOptions.autoplay);
      player.src(src);
    }
  }, [src, options, onReady]);

  useEffect(() => {
    const player = playerRef.current;

    return () => {
      if (player && !player.isDisposed()) {
        player.dispose();
        playerRef.current = null;
      }
    };
  }, [playerRef]);

  return (
    <div data-vjs-player>
      <div ref={videoRef} />
    </div>
  );
};
VideoJs.propTypes = {
  src: PropTypes.string,
  options: PropTypes.object,
  onReady: PropTypes.func,
};
export default VideoJs;

import VideoJS from "./VideoJS";
import Canv from "./Canv";
export const VideoCanv = (options, points) => {


  return (
    <>
      <VideoJS options = {options}></VideoJS>
      <Canv points={points}></Canv>
    </>
  );
};


export default VideoCanv
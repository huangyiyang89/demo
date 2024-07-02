const Videotest = () => {
  return (
    <>
      <div style={{position: "relative", width: 960, height:540,paddingBottom: "56.25%"}}>
        <video
          controls=""
          style={{height: "100%", width: "100%", top: 0, left: 0,position: "absolute", background: "black",}}
        ></video>
        <canvas
          
          
          style={{position: "absolute",top: 0,left: 0,width:"100%",height:"100%"}}
        ></canvas>
      </div>
    </>
  );
};

export default Videotest;

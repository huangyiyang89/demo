
export const api_url = "http://localhost:8000/api/"

export const get_cameras = [
  {
    Camera_id: 1,
    name: "场地A1摄像头",
    description: "hikvision V1 in ground A1",
    Camera_addr: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    frame_height:1080,
    frame_width:1920,
    MAC:"1A:2B:3C:4D",
    state: 1,
    areas:[]
  },
  {
    Camera_id: 2,
    name: "场地A1摄像头",
    description: "hikvision V1 in ground A2",
    Camera_addr: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    frame_height:1080,
    frame_width:1920,
    MAC:"1A:2B:3C:4D",
    state: 1,
    areas:[]
  },
  {
    Camera_id: 3,
    name: "场地A1摄像头",
    description: "hikvision V1 in ground A2",
    Camera_addr: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
    frame_height:1080,
    frame_width:1920,
    MAC:"1A:2B:3C:4D",
    state: 1,
    areas:[]
  }
];


export const get_areas = [
  {
    id: 1,
    name: "area1",
    area_coordinate:"305;182;583;206;471;440;167;342;305;182",
    event_type:"3;2;3;4;5",
    area_type:0,
    time:1928378232,
    Camera_id:1
  },
  {
    id: 2,
    name: "area2",
    area_coordinate:"505;106;577;216;287;338;95;147;285;114;863;512;741;93;505;106",
    event_type:"1;2;3;4;5",
    area_type:0,
    time:1928378232,
    Camera_id:2
  },
  {
    id: 3,
    name: "area3",
    area_coordinate:"295;118;567;194;577;414;181;352;141;243;295;118",
    event_type:"1;2;3;4;5",
    area_type:0,
    time:1928378232,
    Camera_id:1
  }
];




export const detect_types = [
  {
    
  }
];

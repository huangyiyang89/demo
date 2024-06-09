camera:
    camera_id
    name
    description
    src
    state
    start_time

    regions:[
        
    ]

detect_type:
    入侵
    跌倒
    烟火
    积水
    反光衣
    打架
    抽烟
    ........


detect_region:
    region_id
    region_name
    description
    Camera
    type:line or rect
    points:[]
    detect_type:[]
    state://启用，禁用，删除

    events:[]



event:
    id
    Camera
    Detect_region
    detect_type
    time
    thumb:base64
    state:
    pic_url:
    detect_pic_url
    reply_url:







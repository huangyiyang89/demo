// src/EventVideoPlayer.js
import { useRef } from 'react';
import { Layout, List, Avatar } from 'antd';
import VideoJs from '../component/VideoJs'
import 'antd/dist/reset.css';

const { Sider, Content } = Layout;

const events = [
  { id: 1, time: '00:10', description: 'Event 1', thumbnail: 'thumb1.jpg' },
  { id: 2, time: '00:30', description: 'Event 2', thumbnail: 'thumb2.jpg' },
  { id: 3, time: '01:15', description: 'Event 3', thumbnail: 'thumb3.jpg' },
];

const EventVideoPlayer = () => {
  const playerRef = useRef(null);
  const videoJsOptions = {
    autoplay: false,
    controls: true,
    sources: [{
      src: 'your-video-file.mp4',
      type: 'video/mp4'
    }]
  };

  const handleEventClick = (time) => {
    const player = playerRef.current;
    if (player) {
      const [minutes, seconds] = time.split(':').map(Number);
      player.currentTime(minutes * 60 + seconds);
      player.play();
    }
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={300} style={{ background: '#fff', padding: '20px' }}>
        <List
          itemLayout="horizontal"
          dataSource={events}
          renderItem={item => (
            <List.Item onClick={() => handleEventClick(item.time)} style={{ cursor: 'pointer' }}>
              <List.Item.Meta
                avatar={<Avatar src={item.thumbnail} />}
                title={item.description}
                description={`Time: ${item.time}`}
              />
            </List.Item>
          )}
        />
      </Sider>
      <Content style={{ padding: '20px' }}>
        <VideoJs options={videoJsOptions} onReady={handlePlayerReady} />
      </Content>
    </Layout>
  );
};

export default EventVideoPlayer;

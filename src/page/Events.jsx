import React, { useState } from "react";
import {
  Table,
  Flex,
  Tag,
  Typography,
  Space,
  DatePicker,
  Button,
  Image,
  Segmented,
  Card,
  Row,
  Col,
} from "antd";
import EventModal from "../component/EventModal";
import EventImage from "../component/EventImage";

const { Title } = Typography;
const { RangePicker } = DatePicker;


const data = [
  {
    key: "1",
    camera: "camera1",
    detect_photo: "./images/event1.jpg",
    photo: "./images/event1.jpg",
    type: "区域入侵",
    area_name: "禁止进入区",
    time: "2024-04-12 16:45:11",
    state: "已上传",
  },
  {
    key: "2",
    camera: "camera1",
    detect_photo: "./images/event1.jpg",
    photo: "./images/event1.jpg",
    type: "区域入侵",
    area_name: "禁止进入区",
    time: "2024-04-12 16:45:11",
    state: "已上传",
  },
  {
    key: "3",
    camera: "camera1",
    detect_photo: "./images/event1.jpg",
    photo: "./images/event1.jpg",
    type: "区域入侵",
    area_name: "禁止进入区",
    time: "2024-04-12 16:45:11",
    state: "已上传",
  },
  {
    key: "4",
    camera: "camera1",
    detect_photo: "./images/event1.jpg",
    photo: "./images/event1.jpg",
    type: "区域入侵",
    area_name: "禁止进入区",
    time: "2024-04-12 16:45:11",
    state: "已上传",
  },
  {
    key: "5",
    camera: "camera1",
    detect_photo: "./images/event1.jpg",
    photo: "./images/event1.jpg",
    type: "区域入侵",
    area_name: "禁止进入区",
    time: "2024-04-12 16:45:11",
    state: "已上传",
  },
  {
    key: "6",
    camera: "camera1",
    detect_photo: "./images/event1.jpg",
    photo: "./images/event1.jpg",
    type: "区域入侵",
    area_name: "禁止进入区",
    time: "2024-04-12 16:45:11",
    state: "已上传",
  },
  {
    key: "7",
    camera: "camera1",
    detect_photo: "./images/event1.jpg",
    photo: "./images/event1.jpg",
    type: "区域入侵",
    area_name: "禁止进入区",
    time: "2024-04-12 16:45:11",
    state: "已上传",
  },
  {
    key: "8",
    camera: "camera1",
    detect_photo: "./images/event1.jpg",
    photo: "./images/event1.jpg",
    type: "区域入侵",
    area_name: "禁止进入区",
    time: "2024-04-12 16:45:11",
    state: "已上传",
  },
  {
    key: "9",
    camera: "camera1",
    detect_photo: "./images/event1.jpg",
    photo: "./images/event1.jpg",
    type: "区域入侵",
    area_name: "禁止进入区",
    time: "2024-04-12 16:45:11",
    state: "已上传",
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

//tag data
const tagsData = [
  "全部",
  "入侵",
  "跌倒",
  "烟火",
  "积水",
  "反光衣",
  "打架",
  "抽烟",
];

const onOk = (value) => {
  console.log("onOk: ", value);
};

const Events = () => {
  //tags
  const [selectedTags, setSelectedTags] = useState(["全部"]);
  const handleChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    console.log("You are interested in: ", nextSelectedTags);
    setSelectedTags(nextSelectedTags);
  };

  //modal
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const openModal = (event) => {
    console.log(selectedEvent);
    setSelectedEvent(event);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };

  //view mode
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'

  //table columns
  const columns = [
    {
      title: "序号",
      dataIndex: "key",
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "检测照",
      dataIndex: "detect_photo",
      showSorterTooltip: {
        target: "full-header",
      },
      render: (text, record) => (
        <Image
          width={108}
          src={record.detect_photo}
          preview={{
            src: record.detect_photo,
          }}
        />
      ),
    },
    {
      title: "全景照",
      dataIndex: "photo",
      showSorterTooltip: {
        target: "full-header",
      },
      render: (text, record) => (
        <Image
          width={108}
          src={record.detect_photo}
          preview={{
            src: record.detect_photo,
          }}
        />
      ),
    },
    {
      title: "摄像机",
      dataIndex: "camera",
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "类型",
      dataIndex: "type",
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "区域名称",
      dataIndex: "area_name",
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "时间",
      dataIndex: "time",
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "状态",
      dataIndex: "state",
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "操作",
      dataIndex: "action",
      showSorterTooltip: {
        target: "full-header",
      },
      render: (text, record) => (
        <Button type="primary" size="middle" onClick={() => openModal(record)}>
          查看详情
        </Button>
      ),
    },
  ];

  return (
    <Space
      direction="vertical"
      size="middle"
      style={{
        display: "flex",
      }}
    >
      <Title level={4}>事件列表</Title>

      <Flex gap="small" wrap align="center" justify="space-between">
        <Flex>
          {tagsData.map((tag) => (
            <Tag.CheckableTag
              key={tag}
              checked={selectedTags.includes(tag)}
              onChange={(checked) => handleChange(tag, checked)}
            >
              {tag}
            </Tag.CheckableTag>
          ))}
        </Flex>
        <Flex gap="small">
          {/* <Button type="primary" icon={<ReloadOutlined />}></Button> */}
          <RangePicker
            showTime={{
              format: "HH:mm",
            }}
            format="YYYY-MM-DD HH:mm"
            onChange={(value, dateString) => {
              console.log("Selected Time: ", value);
              console.log("Formatted Selected Time: ", dateString);
            }}
            onOk={onOk}
          />
          <Segmented
            options={["今天", "本周", "本月"]}
            onChange={(value) => {
              console.log(value); // string
            }}
          />
          <Button
            onClick={() => setViewMode(viewMode === "table" ? "card" : "table")}
          >
            {viewMode === "table" ? "卡片视图" : "表格视图"}
          </Button>
        </Flex>
      </Flex>

      {viewMode === "table" ? (
        <Table
          columns={columns}
          dataSource={data}
          onChange={onChange}
          showSorterTooltip={{
            target: "sorter-icon",
          }}
        />
      ) : (
        <Row gutter={16}>
          {data.map((item) => (
            <Col span={8} key={item.key}>
              <Card cover={<EventImage event={item} />}>
                <Card.Meta
                  title={
                    <Flex justify="space-between">
                      <span>{item.camera}</span>
                      <span>{item.type}</span>
                    </Flex>
                  }
                  description={
                    <Flex justify="space-between">
                      <span>{item.area_name} </span>
                      <span>{item.time}</span>
                    </Flex>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      <EventModal
        event={{
          id: "2024022411221",
          camera: "摄像头1",
          detect_type: "抽烟",
          pic_url: "./images/event1.jpg",
        }}
        open={open}
        onClose={handleClose}
      ></EventModal>
    </Space>
  );
};

export default Events;

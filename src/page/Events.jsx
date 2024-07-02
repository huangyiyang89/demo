import { useEffect, useState } from "react";
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
  message,
  Modal,
} from "antd";
import EventImage from "../component/EventImage";
import {
  fetchCameras,
  fetchEventTypes,
  fetchEvents,
  localtime,
} from "../service";
import dayjs from "dayjs";
import EventView from "../component/EventView";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const onOk = (value) => {
  console.log("onOk: ", value);
};

const Events = () => {
  //data
  const [events, setEvents] = useState([]);
  //modal
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  //view mode
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
  //tags
  const [allTags, setAllTags] = useState([]);
  const [selectedTagNames, setSelectedTags] = useState([]);
  const [inputRange, setInputRange] = useState({
    start: dayjs().startOf("d"),
    end: dayjs().endOf("d"),
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const cameras = await fetchCameras();
      const events = await fetchEvents();
      const eventTypes = await fetchEventTypes();
      const allTags = eventTypes.map((eventType) => ({
        name: eventType.name,
        count: 0,
      }));

      events.forEach((event) => {
        event.camera = cameras.find(
          (camera) => camera.Camera_id === event.Camera_id
        );
        allTags.forEach((tag) => {
          if (event.event === tag.name) {
            tag.count++;
          }
        });
      });

      setEvents(events);
      setAllTags(allTags);
    } catch (error) {
      message.error(error);
    }
  };

  const openModal = (event) => {
    console.log(selectedEvent);
    setSelectedEvent(event);
    setOpen(true);
  };
  const handleClose = () => {
    console.log("closed");
    setOpen(false);
    setSelectedEvent(null);
  };
  const handleTagChange = (tagName, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTagNames, tagName]
      : selectedTagNames.filter((t) => t !== tagName);
    console.log(nextSelectedTags);
    setSelectedTags(nextSelectedTags);

    // if (selectedTags.length === 0) {
    //   setFilteredEvents(events);
    // } else {
    //   setFilteredEvents(
    //     events.filter((event) => selectedTags.includes(event.event))
    //   );
    // }
  };

  const filteredEvents = events.filter(
    (event) =>
      selectedTagNames.length === 0 || selectedTagNames.includes(event.event)
  );

  //table columns
  const columns = [
    {
      title: "序号",
      dataIndex: "id",
      showSorterTooltip: {
        target: "full-header",
      },
      width: 60,
    },
    {
      title: "检测照",
      dataIndex: "image",
      showSorterTooltip: {
        target: "full-header",
      },
      ellipsis: true,
      render: (text, record) => (
        <Image
          width={108}
          src={record.image}
          preview={{
            src: record.image,
          }}
          style={{borderRadius:"4px"}}
        />
      ),
    },
    {
      title: "摄像机",
      dataIndex: "camera",
      showSorterTooltip: {
        target: "full-header",
      },
      ellipsis: true,
      render: (text, record) => (
        <span>{record.camera ? record.camera.name : "已删除"}</span>
      ),
    },
    {
      title: "事件类型",
      dataIndex: "event",
      ellipsis: true,
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "区域名称",
      dataIndex: "area",
      ellipsis: true,
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "时间",
      dataIndex: "time",
      ellipsis: true,
      showSorterTooltip: {
        target: "full-header",
      },
      render: (text, record) => <span>{localtime(record.time)}</span>,
    },
    {
      title: "状态",
      dataIndex: "is_upload",
      ellipsis: true,
        showSorterTooltip: {
          target: "full-header",
        },
      render: (text, record) => (
        <span>{record.is_upload ? "已上传" : "未上传"}</span>
      ),
    },
    {
      title: "操作",
      dataIndex: "action",
      showSorterTooltip: {
        target: "full-header",
      },
      width:150,
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
          <Tag.CheckableTag
            checked={selectedTagNames.length == 0}
            onChange={() => setSelectedTags([])}
          >
            {"全部" + " " + events.length}
          </Tag.CheckableTag>
          {allTags.map((tag) => (
            <Tag.CheckableTag
              key={tag.name}
              checked={selectedTagNames.includes(tag.name)}
              onChange={(checked) => handleTagChange(tag.name, checked)}
            >
              {tag.name + " " + tag.count}
            </Tag.CheckableTag>
          ))}
        </Flex>
        <Flex gap="small">
          {/* <Button type="primary" icon={<ReloadOutlined />}></Button> */}
          <RangePicker
            value={[inputRange.start, inputRange.end]}
            showTime={{
              format: "HH:mm",
            }}
            format="YYYY-MM-DD HH:mm"
            onChange={(value, dateString) => {
              console.log(dateString);
              setInputRange({ start: value[0], end: value[1] });
            }}
            onOk={onOk}
          />
          <Segmented
            options={["今天", "本周", "本月"]}
            onChange={(value) => {
              if (value === "今天") {
                setInputRange({
                  start: dayjs().startOf("d"),
                  end: dayjs().endOf("d"),
                });
              }
              if (value === "本周") {
                setInputRange({
                  start: dayjs().startOf("w"),
                  end: dayjs().endOf("w"),
                });
              }
              if (value === "本月") {
                setInputRange({
                  start: dayjs().startOf("M"),
                  end: dayjs().endOf("M"),
                });
              }
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
          dataSource={filteredEvents}
          onChange={onChange}
        />
      ) : (
        <Row gutter={[8, 12]}>
          {filteredEvents.map((event) => (
            <Col span={8} key={event.key}>
              <Card cover={<EventImage event={event} />}>
                <Card.Meta
                  title={
                    <Flex justify="space-between">
                      <span>{event.camera ? event.camera.name : "已删除"}</span>
                      <span>{event.event}</span>
                    </Flex>
                  }
                  description={
                    <Flex justify="space-between">
                      <span>{event.area} </span>
                      <span>{localtime(event.time)}</span>
                    </Flex>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <Modal
        open={open}
        onCancel={handleClose}
        footer={[]}
        width={"70vw"}
        destroyOnClose
        closable={false}
        centered
        maskClosable={true}
      >
        <EventView event={selectedEvent}></EventView>
      </Modal>
    </Space>
  );
};

export default Events;

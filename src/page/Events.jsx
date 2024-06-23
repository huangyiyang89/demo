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
} from "antd";
import EventModal from "../component/EventModal";
import EventImage from "../component/EventImage";
import { fetchEventTypes, fetchEvents, localtime } from "../service";
import { render } from "react-dom";

const { Title } = Typography;
const { RangePicker } = DatePicker;

const onChange = (pagination, filters, sorter, extra) => {
  console.log("params", pagination, filters, sorter, extra);
};

const onOk = (value) => {
  console.log("onOk: ", value);
};

const Events = () => {
  const [filters, setFilters] = useState([]);
  const [events, setEvents] = useState([]);
  //modal
  const [open, setOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  //view mode
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'

  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    fetchEvents().then((data) => {
      setEvents(data);
    });
    fetchEventTypes().then((data) => {
      setFilters(
        data.map((eventType) => {
          return { value: eventType.name, name: eventType.name };
        })
      );
    });
  }, []);

  const openModal = (event) => {
    console.log(selectedEvent);
    setSelectedEvent(event);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedEvent(null);
  };
  const handleTagChange = (tag, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, tag]
      : selectedTags.filter((t) => t !== tag);
    setSelectedTags(nextSelectedTags);
    filterEvents(nextSelectedTags);
  };

  const filterEvents = (tags) => {
    if (tags.length === 0) {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter((event) => tags.includes(event.event));
      setFilteredEvents(filtered);
    }
  };
  //table columns
  const columns = [
    {
      title: "序号",
      dataIndex: "id",
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "检测照",
      dataIndex: "image",
      showSorterTooltip: {
        target: "full-header",
      },
      render: (text, record) => (
        <Image
          width={108}
          src={record.image}
          preview={{
            src: record.image,
          }}
        />
      ),
    },
    {
      title: "摄像机编号",
      dataIndex: "Camera_id",
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "事件类型",
      dataIndex: "event",
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "区域名称",
      dataIndex: "area",
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
      render: (text, record) => <span>{localtime(record.time)}</span>,
    },
    {
      title: "状态",
      dataIndex: "is_upload",
      showSorterTooltip: {
        target: "full-header",
      },
      render: (text, record) => <span>{record.is_upload?"已上传":"未上传"}</span>,
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
          {filters.map((tag) => (
            <Tag.CheckableTag key={tag.name}>{tag.name}</Tag.CheckableTag>
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
          dataSource={events}
          onChange={onChange}
          showSorterTooltip={{
            target: "sorter-icon",
          }}
        />
      ) : (
        <Row gutter={[8,12]}>
          {events.map((event) => (
            <Col span={8} key={event.key}>
              <Card cover={<EventImage event={event} />}>
                <Card.Meta
                  title={
                    <Flex justify="space-between">
                      <span>{event.Camera_id}</span>
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

      <EventModal
        event={selectedEvent}
        open={open}
        onClose={handleClose}
      ></EventModal>
    </Space>
  );
};

export default Events;

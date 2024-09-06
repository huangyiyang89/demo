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
  message,
  Modal,
  List,
} from "antd";
import EventImage from "../component/EventImage";
import dayjs from "dayjs";
import EventView from "../component/EventView";
import axios from "axios";

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
  const [viewMode, setViewMode] = useState("card"); // 'table' or 'card'
  //tags
  const [eventtypes, setEventtypes] = useState([]);
  const [selectedEventtypes, setSelectedEventtypes] = useState([]);

  const [inputRange, setInputRange] = useState({
    start: dayjs().startOf("w"),
    end: dayjs().endOf("w"),
    tag: "本周",
  });
  const [loading, setLoading] = useState(false);

  const filteredEvents = events.filter((event) =>
    selectedEventtypes.find(
      (type) => type.id === event.eventtype_id && type.checked
    )
  );

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const response = await axios.get(`/api/eventtypes/`);
        const eventtypes = response.data;
        console.log("eventtypes:", eventtypes);
        eventtypes.forEach((type) => {
          type.count = 0;
          type.checked = true;
        });
        setEventtypes(eventtypes);
      } catch (error) {
        if (error.response.status==500) {
          message.error("服务器未响应，，拉取事件类型列表失败！");
        } else {
          message.error(error.response.data.message);
        }
      }
    };
    fetchEventTypes();
  }, []);

  useEffect(() => {
    const fetchEvents = async (start, end) => {
      try {
        const response = await axios.get(
          `/api/events/?start_time=${start}&end_time=${end}`
        );
        const events = response.data;
        console.log("events:", events);
        setEvents(events);
      } catch (error) {
        if (error.response.status==500) {
          message.error("服务器未响应，拉取事件列表失败！");
        } else {
          message.error(error.response.data.message);
        }
      }
    };
    setLoading(true);
    fetchEvents(inputRange.start.unix(), inputRange.end.unix());
    setLoading(false);
  }, [inputRange]);

  //tag标签增加数量
  useEffect(() => {
    const new_eventtypes = eventtypes.map((type) => {
      type.count = events.filter(
        (event) => event.eventtype_id === type.id
      ).length;
      return type;
    });
    setSelectedEventtypes(new_eventtypes);
  }, [events, eventtypes]);

  const openModal = (event) => {
    setSelectedEvent(event);
    setOpen(true);
  };
  const handleClose = () => {
    setSelectedEvent(null);
    setOpen(false);
  };
  const handleTagChange = (eventtype, checked) => {
    const new_eventtypes = selectedEventtypes.map((type) => {
      if (type.id === eventtype.id) {
        type.checked = checked;
      }
      return type;
    });
    setSelectedEventtypes(new_eventtypes);
  };

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
      dataIndex: "image_url",
      showSorterTooltip: {
        target: "full-header",
      },
      ellipsis: true,
      render: (text, record) => (
        <Image
          width={108}
          src={record.image_url}
          preview={{
            src: record.image_url,
          }}
          style={{ borderRadius: "4px" }}
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
      dataIndex: "eventtype",
      ellipsis: true,
      showSorterTooltip: {
        target: "full-header",
      },
      render: (text, record) => <span>{record.eventtype.name}</span>,
    },
    {
      title: "区域名称",
      dataIndex: "area_name",
      ellipsis: true,
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "时间",
      dataIndex: "localtime",
      ellipsis: true,
      showSorterTooltip: {
        target: "full-header",
      },
    },
    {
      title: "状态",
      dataIndex: "uploaded",
      ellipsis: true,
      showSorterTooltip: {
        target: "full-header",
      },
      render: (text, record) => (
        <span>{record.uploaded ? "已上传" : "未上传"}</span>
      ),
    },
    {
      title: "操作",
      dataIndex: "action",
      showSorterTooltip: {
        target: "full-header",
      },
      width: 150,
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
            checked={selectedEventtypes.every((type) => type.checked)}
            onChange={(checked) =>
              setEventtypes(
                selectedEventtypes.map((type) => {
                  type.checked = checked;
                  return type;
                })
              )
            }
          >
            {"全部" + " " + events.length}
          </Tag.CheckableTag>
          {eventtypes.map((eventtype) => (
            <Tag.CheckableTag
              key={"tag" + eventtype.id}
              checked={eventtype?.checked}
              onChange={(checked) => handleTagChange(eventtype, checked)}
            >
              {eventtype.name + " " + eventtype.count}
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
            value={inputRange.tag}
            options={["今天", "本周", "本月"]}
            onChange={(value) => {
              if (value === "今天") {
                setInputRange({
                  start: dayjs().startOf("d"),
                  end: dayjs().endOf("d"),
                  tag: value,
                });
              }
              if (value === "本周") {
                setInputRange({
                  start: dayjs().startOf("w"),
                  end: dayjs().endOf("w"),
                  tag: value,
                });
              }
              if (value === "本月") {
                setInputRange({
                  start: dayjs().startOf("M"),
                  end: dayjs().endOf("M"),
                  tag: value,
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
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={filteredEvents}
          onChange={onChange}
        />
      ) : (
        <List
          loading={loading}
          pagination={{
            pageSize: 12,
          }}
          grid={{ column: 4 }}
          dataSource={filteredEvents}
          renderItem={(event) => (
            <div style={{ margin: 16 }}>
              <Card cover={<EventImage event={event} />}>
                <Card.Meta
                  title={
                    <Flex justify="space-between">
                      <span>{event.camera ? event.camera.name : "已删除"}</span>
                      <span>{event.eventtype.name}</span>
                    </Flex>
                  }
                  description={
                    <Flex justify="space-between">
                      <span>{event.area_name} </span>
                      <span>{event.localtime}</span>
                    </Flex>
                  }
                />
              </Card>
            </div>
          )}
        />
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

import { useState, useEffect, useRef } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Popconfirm,
  Typography,
  message,
  Flex,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import VideoJs from "../component/VideoJs";
import Canv from "../component/Canv";
import { AreaEditor } from "../component/AreaEditor";
import {
  convertPolygonPoints,
  fetchCameras,
  fetchAreas,
  fetchEventTypes,
  deleteArea,
} from "../service";

const { Title } = Typography;

const Areas = () => {
  const [areas, setAreas] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArea, setCurrentArea] = useState(null);
  const [form] = Form.useForm();
  const [filter, setFilter] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedArea, setSelectedArea] = useState([]);

  useEffect(() => {
    try {
      fetchAreas().then((data) => setAreas(data));
      fetchCameras().then((data) => setCameras(data));
      fetchEventTypes().then((data) => setEventTypes(data));
    } catch (error) {
      console.error("Failed to fetch", error);
    }
  }, []);

  const refreshData = () => {
    fetchAreas().then((data) => setAreas(data));
  };
  const showModal = (area = null) => {
    setCurrentArea(area);
    setIsEditing(!!area);
    form.setFieldsValue(area || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentArea(null);
    refreshData();
  };

  const handleOk = async () => {
    closeModal();
  };

  const getEventTypeNames = (eventTypeStr) => {
    const eventTypeIds = eventTypeStr.split(";");
    return eventTypeIds
      .map((id) => {
        const eventType = eventTypes.find(
          (event) => event.id === parseInt(id, 10)
        );
        return eventType ? eventType.name : id;
      })
      .join("; ");
  };

  const columns = [
    { title: "编号", dataIndex: "id", key: "id" },
    { title: "区域名称", dataIndex: "name", key: "id" },
    {
      title: "摄像机",
      dataIndex: "Camera_id",
      key: "id",
      render: (text) => {
        const camera = cameras.find((camera) => camera.Camera_id === text);
        return camera ? camera.name : text;
      },
    },
    {
      title: "事件类型",
      dataIndex: "event_type",
      key: "id",
      render: (text) => getEventTypeNames(text),
    },
    {
      title: "区域类型",
      dataIndex: "area_type",
      key: "id",
      render: (text) => (text === 0 ? "多边形" : text),
    },
    { title: "时间戳", dataIndex: "time", key: "id" },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span>
          <Button
            type="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              const camera = cameras.find(
                (cam) => cam.Camera_id === record.Camera_id
              );
              showModal({ ...record, camera });
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            onConfirm={(e) => {
              e.stopPropagation();
              deleteArea(record.id);
              refreshData();
            }}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              type="primary"
              size="small"
              danger
              style={{ marginLeft: "8px" }}
              onClick={(e) => e.stopPropagation()}
            >
              删除
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const onRowClick = (record) => {
    return {
      onClick: (event) => {
        if (
          event.target.tagName === "BUTTON" ||
          event.target.tagName === "SPAN"
        ) {
          return; // 如果点击的是按钮，则不触发行选择
        }

        const selectedIndex = selectedRowKeys.indexOf(record.id);
        let newSelectedRowKeys = [...selectedRowKeys];
        if (selectedIndex >= 0) {
          newSelectedRowKeys.splice(selectedIndex, 1);
        } else {
          newSelectedRowKeys.push(record.id);
        }
        setSelectedRowKeys(newSelectedRowKeys);

        // Update selectedArea based on newSelectedRowKeys
        const newSelectedArea = areas.filter((area) =>
          newSelectedRowKeys.includes(area.id)
        );
        setSelectedArea(newSelectedArea);
      },
    };
  };

  const filteredAreas = selectedCamera
    ? areas.filter((area) => area.Camera_id === selectedCamera.Camera_id)
    : areas;

  return (
    <div>
      <Title level={4}>区域设置</Title>

      <div
        style={{
          display: "flex",
          gap: "64px",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        <div style={{ flex: 2 }}>
          <Flex justify="space-between">
            <Button
              type="primary"
              onClick={() => showModal()}
              style={{ marginBottom: "10px", alignSelf: "flex-end" }}
            >
              添加检测区域
            </Button>
            <Select
              allowClear
              options={cameras.map((camera) => ({
                value: camera.Camera_id,
                label: camera.name,
              }))}
              placeholder="选择摄像机筛选"
              onChange={(e) => {
                const selectedCamera = cameras.find(
                  (camera) => camera.Camera_id === e
                );
                setSelectedCamera(selectedCamera);
              }}
            ></Select>
          </Flex>
          <Table
            rowSelection={{
              selectedRowKeys,
              onChange: (keys) => {
                setSelectedRowKeys(keys);
                const newSelectedArea = areas.filter((area) =>
                  keys.includes(area.id)
                );
                setSelectedArea(newSelectedArea);
              },
            }}
            columns={columns}
            dataSource={filteredAreas.filter((area) =>
              area.name.includes(filter)
            )}
            rowKey="id"
            onRow={onRowClick}
          />
        </div>
        <div style={{ flex: 1, position: "relative" }}>
          <VideoJs src={selectedCamera ? selectedCamera.Camera_addr : null} />
          {selectedArea.map((area) => (
            <Canv
              key={area.id}
              shape={{
                type: "polygon",
                data: convertPolygonPoints(area.area_coordinate),
              }}
            />
          ))}
        </div>
      </div>

      <Modal
        title={isEditing ? "编辑检测区域" : "添加检测区域"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={closeModal}
        width={1334}
        footer={[]}
      >
        <AreaEditor
          key={currentArea ? currentArea.id : "new"}
          camera={currentArea?.camera}
          area={currentArea}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Areas;

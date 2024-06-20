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
  const playerRef = useRef(null);
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

  const showModal = (area = null) => {
    if (!selectedCamera) {
      message.info("请选择一个摄像机");
      return;
    }
    setCurrentArea(area);
    setIsEditing(!!area);
    form.setFieldsValue(area || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentArea(null);
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
    { title: "区域编号", dataIndex: "id", key: "id" },
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
          <Button type="primary" size="small" onClick={() => showModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            onConfirm={() => deleteArea(record.id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              type="primary"
              size="small"
              danger
              style={{ marginLeft: "8px" }}
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
      onClick: () => {
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
        console.log(selectedArea);
      },
    };
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  const filteredAreas = selectedCamera
    ? areas.filter((area) => area.Camera_id === selectedCamera.Camera_id)
    : areas;

  return (
    <div>
      <Title level={4}>区域设置</Title>

      <div style={{ display: "flex", gap: "64px" }}>
        <div style={{ flex: 1 }}>
          <Select
            options={cameras.map((camera) => ({
              value: camera.Camera_id,
              label: camera.name,
            }))}
            placeholder="选择摄像机"
            onChange={(e) => {
              const selectedCamera = cameras.find(
                (camera) => camera.Camera_id === e
              );
              setSelectedCamera(selectedCamera);
            }}
          ></Select>
          <Button
            type="primary"
            onClick={() => showModal()}
            style={{ marginBottom: "10px", alignSelf: "flex-end" }}
          >
            添加区域
          </Button>
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
          <VideoJs
            onReady={handlePlayerReady}
            options={{
              sources: [
                { src: selectedCamera ? selectedCamera.Camera_addr : null },
              ],
            }}
            style={{ width: "100%" }}
          />
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
          key={selectedCamera ? selectedCamera.Camera_id : "new"}
          camera={selectedCamera}
          area={currentArea}
          onClose={closeModal}
        />
      </Modal>
    </div>
  );
};

export default Areas;

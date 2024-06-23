import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  Popconfirm,
  Typography,
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
  localtime,
} from "../service";

const { Title } = Typography;

const Areas = () => {
  const [areas, setAreas] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [eventTypes, setEventTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [editingArea, setEditingArea] = useState(null);
  const [form] = Form.useForm();
  const [filter, setFilter] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedAreas, setSelectedAreas] = useState([]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = async () => {
    try {
      const cameras = await fetchCameras();
      const areas = await fetchAreas();
      const eventTypes = await fetchEventTypes();
      const areasWithDetails = areas.map((area) => ({
        ...area,
        camera: cameras.find((camera) => camera.Camera_id === area.Camera_id),
      }));
      setAreas(areasWithDetails);
      setCameras(cameras);
      setEventTypes(eventTypes);
    } catch (error) {
      console.error("Failed to fetch", error);
    }
  };

  const showNewModal = () => {
    setEditingArea(null);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const showEditModal = (area = null) => {
    setEditingArea(area);
    setIsEditing(true);
    form.setFieldsValue(area || {});
    setIsModalOpen(true);
  };

  const handleModalClosed = () => {
    setIsModalOpen(false);
    setEditingArea(null);
  };

  const handleUpdate = async () => {
    setIsModalOpen(false);
    setEditingArea(null);
    refreshData();
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
    { title: "ID", dataIndex: "id", key: "id" ,width:50},
    { title: "区域名称", dataIndex: "name", key: "id",width:100 },
    {
      title: "摄像机",
      dataIndex: "Camera_id",
      key: "id",
      width: 160,
      render: (text) => {
        const camera = cameras.find((camera) => camera.Camera_id === text);
        return camera ? camera.name : text;
      },
    },
    {
      title: "事件类型",
      dataIndex: "event_type",
      key: "id",
      ellipsis: true,
      width: 160,
      render: (text) => getEventTypeNames(text),
    },
    {
      title: "类型",
      dataIndex: "area_type",
      key: "id",
      width: 80,
      render: (text) => (text === 0 ? "多边形" : text),
    },
    {
      title: "时间戳",
      dataIndex: "time",
      key: "id",
      width: 160,
      render: (time) => <span>{localtime(time)}</span>,
    },
    {
      title: "操作",
      width: 140,
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
              showEditModal({ ...record, camera });
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
        setSelectedAreas(newSelectedArea);
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
              onClick={() => showNewModal()}
              style={{ marginBottom: "10px", alignSelf: "flex-end" }}
            >
              添加检测区域
            </Button>
            <Select
              allowClear
              style={{ width: "200px" }}
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
                setSelectedRowKeys([]);
                setSelectedAreas([]);
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
                setSelectedAreas(newSelectedArea);
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
          {selectedAreas.map((area) => (
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
        onCancel={handleModalClosed}
        width={1334}
        footer={[]}
        destroyOnClose={true}
      >
        <AreaEditor
          key={editingArea ? editingArea.id : null}
          camera={editingArea?.camera}
          area={editingArea}
          onUpdate={handleUpdate}
        />
      </Modal>
    </div>
  );
};

export default Areas;

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
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
    setIsModalOpen(true);
  };

  const handleModalClosed = () => {
    setIsModalOpen(false);
    setEditingArea(null);
  };

  //修改新增成功都触发
  const handleUpdate = async (data) => {
    if (isEditing && editingArea) {
      console.log(data);
      const newAreas = selectedAreas
        .filter((area) => area.id != editingArea.id)
        .concat(data);
      setSelectedAreas(newAreas);
      console.log(newAreas);
    }
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
    { title: "ID", dataIndex: "id", key: "id",width:55,},
    { title: "区域名称", dataIndex: "name", key: "id",width:90,},
    {
      title: "摄像机",
      dataIndex: "Camera_id",
      key: "id",
      width:80,
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
      render: (text) => getEventTypeNames(text),
    },
    // {
    //   title: "类型",
    //   dataIndex: "area_type",
    //   key: "id",
    //   width: 80,
    //   render: (text) => (text === 0 ? "多边形" : text),
    // },
    {
      title: "修改时间",
      dataIndex: "time",
      key: "id",
      width:160,
      render: (time) => <span>{localtime(time)}</span>,
    },
    {
      title: "操作",
      key: "action",
      width:135,
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
              setSelectedAreas(
                selectedAreas.filter((id) => id != record.id)
              );
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

        if (selectedAreas.includes(record)) {
          setSelectedAreas(
            selectedAreas.filter((area) => area.id != record.id)
          );
        } else {
          setSelectedAreas(selectedAreas.concat(record));
        }
      },
    };
  };

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
                setSelectedAreas([]);
                setSelectedAreas([]);
              }}
            ></Select>
          </Flex>
          <Table
            rowSelection={{
              selectedRowKeys:selectedAreas.map(area=>area.id),
              onChange: (keys,rows) => {
                setSelectedAreas(rows);
              },
            }}
            columns={columns}
            dataSource={
              selectedCamera
                ? areas.filter(
                    (area) => area.Camera_id === selectedCamera.Camera_id
                  )
                : areas
            }
            rowKey="id"
            onRow={onRowClick}
          />
        </div>
        <div style={{ flex: 1, position: "relative",maxWidth:600 }}>
          <VideoJs src={selectedCamera ? selectedCamera.Camera_addr : null} />
          {selectedAreas.map((area) => (
            <Canv
              key={area.area_coordinate}
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

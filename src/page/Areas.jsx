import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Select,
  Popconfirm,
  Typography,
  Flex,
  message,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { AreaEditor } from "../component/AreaEditor";
import FlvPlayer from "../component/FlvPlayer";
import PolygonCanv from "../component/PolygonCanv";
import axios from "axios";
import AlgoEditor from "../component/AlgoEditor";

const { Title } = Typography;

const Areas = () => {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isAlgoModalOpen, setIsAlgoModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [editingArea, setEditingArea] = useState(null);
  const [selectedAreas, setSelectedAreas] = useState([]);

  const refreshData = async () => {
    try {
      const response = await axios.get("/api/cameras/");
      setCameras(response.data);
    } catch (error) {
      console.error("Failed to fetch", error);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  useEffect(() => {
    //默认选中第一格摄像机
    if (!selectedCamera && cameras && cameras.length > 0) {
      setSelectedCamera(cameras[0]);
    }

    if (selectedCamera) {
      setSelectedCamera(
        cameras.find((camera) => camera.id === selectedCamera.id)
      );
    }
  }, [cameras, selectedCamera]);

  const showNewModal = () => {
    if (!selectedCamera) {
      message.error("请先设置录像通道！");
      return;
    }
    setEditingArea(null);
    setIsEditing(false);
    setIsAreaModalOpen(true);
    setIsAlgoModalOpen(false);
  };

  const showEditModal = (area = null) => {
    setEditingArea(area);
    setIsEditing(true);
    setIsAreaModalOpen(true);
    setIsAlgoModalOpen(false);
  };

  const showAlgoModal = (area = null) => {
    setEditingArea(area);
    setIsEditing(false);
    setIsAlgoModalOpen(true);
    setIsAreaModalOpen(false);
  };

  const handleModalClosed = () => {
    setIsAreaModalOpen(false);
    setIsAlgoModalOpen(false);
    setEditingArea(null);
  };

  //修改新增成功都触发
  const handleUpdate = async (data) => {
    if (isEditing && editingArea) {
      const newAreas = selectedAreas
        .filter((area) => area.id != editingArea.id)
        .concat(data);
      setSelectedAreas(newAreas);
    }

    refreshData();
    setIsAreaModalOpen(false);
    setIsAlgoModalOpen(false);
    setEditingArea(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("/api/areas/" + id);
      setSelectedAreas(selectedAreas.filter((area) => area.id !== id));
      refreshData();
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.detail);
      } else {
        message.error(error.message);
      }
    }
  };

  const columns = [
    // { title: "ID", dataIndex: "id", key: "id", width: 60  },
    {
      title: "检测区域名称",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
      width: "20%",
    },
    {
      title: "摄像机",
      dataIndex: "camera",
      ellipsis: true,
      key: "camera",
      width: "20%",
      render: (camera) => {
        return camera?.name;
      },
    },
    {
      title: "修改时间",
      dataIndex: "localtime",
      key: "localtime",
      ellipsis: true,
      width: "20%",
    },
    {
      title: "检测参数",
      key: "algo",
      width: "10%",
      render: (text, record) => (
        <Button type="primary" size="small" onClick={(e) => {
          e.stopPropagation();
          showAlgoModal(record);
        }}>
          设置
        </Button>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (text, record) => (
        <div>
          <Button
            type="primary"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              showEditModal(record);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            onConfirm={(e) => {
              e.stopPropagation();
              handleDelete(record.id);
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
        </div>
      ),
    },

  ];

  const onRowClick = (record) => {
    return {
      onClick: (event) => {
        if (event.target.tagName === "BUTTON") {
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
      <Title level={4}>检测区域设置</Title>

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
              style={{ width: "200px" }}
              options={cameras.map((camera) => ({
                value: camera.id,
                label: camera.name,
              }))}
              placeholder="选择摄像机"
              onChange={(e) => {
                const selectedCamera = cameras.find(
                  (camera) => camera.id === e
                );
                setSelectedCamera(selectedCamera);
                setSelectedAreas([]);
              }}
              value={selectedCamera?.name}
            ></Select>
          </Flex>
          <Table
            rowSelection={{
              selectedRowKeys: selectedAreas.map((area) => area.id),
              onChange: (keys, rows) => {
                setSelectedAreas(rows);
              },
            }}
            columns={columns}
            dataSource={selectedCamera?.areas}
            rowKey="id"
            onRow={onRowClick}
          />
        </div>
        <div style={{ flex: 1 }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: selectedCamera
                ? (
                    (selectedCamera.frame_height / selectedCamera.frame_width) *
                    100
                  ).toString() + "%"
                : "56.25%",
            }}
          >
            <FlvPlayer url={selectedCamera?.ip_addr}></FlvPlayer>
            {selectedAreas.map((area) => (
              <PolygonCanv
                key={area.id}
                videoWidth={selectedCamera?.frame_width}
                data={area.coordinates}
              ></PolygonCanv>
            ))}
          </div>
        </div>
      </div>

      <Modal
        title={isEditing ? "编辑检测区域" : "添加检测区域"}
        open={isAreaModalOpen}
        onCancel={handleModalClosed}
        width={
          selectedCamera?.frame_width / selectedCamera?.frame_height === 16 / 9
            ? 1324
            : 1324 - 240
        }
        footer={[]}
        destroyOnClose={true}
      >
        <div style={{ padding: 20 }}>
          <AreaEditor
            key={editingArea ? "area"+editingArea.id : null}
            camera={selectedCamera}
            area={editingArea}
            onUpdate={handleUpdate}
          />
        </div>
      </Modal>
      
      <Modal
        title={"编辑检测参数"}
        open={isAlgoModalOpen}
        onCancel={handleModalClosed}
        footer={[]}
        destroyOnClose={true}
      >
        <div style={{ padding: 20 }}>
          <AlgoEditor
            key={editingArea ? "algo"+editingArea.id : null}
            area={editingArea}
            onUpdate={handleUpdate}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Areas;

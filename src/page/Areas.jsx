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
import CrossLinesCanv from "../component/CrossLinesCanv";
import CrossDirectionCanv from "../component/CrossDirectionCanv";

const { Title } = Typography;

const Areas = () => {
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isAreaModalOpen, setIsAreaModalOpen] = useState(false);
  const [isAlgoModalOpen, setIsAlgoModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [editingArea, setEditingArea] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);

  const refreshData = async () => {
    try {
      const response = await axios.get("/api/cameras/");
      const cameras = response.data;
      console.log("cameras:", cameras);
      setCameras(cameras);
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
      setSelectedArea(data);
    }
    refreshData();
    setIsAreaModalOpen(false);
    setIsAlgoModalOpen(false);
    setEditingArea(null);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete("/api/areas/" + id);
      if (selectedArea?.id == id) {
        setSelectedArea(null);
      }
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
        <Button
          type="primary"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            showAlgoModal(record);
          }}
        >
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
            description="注意！该区域下所有设置会同步删除。"
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
        if (record) {
          setSelectedArea(record);
        } else {
          setSelectedArea(null);
        }
      },
    };
  };

  return (
    <div>
      <Title level={4}>
        检测区域
        <span>
          <Button
            onClick={() =>
              (window.location.href = axios.defaults.baseURL + "/api/cameras/")
            }
            size="small"
            style={{ marginLeft: 20}}
          >
            【测试】查看完整JSON
          </Button>
        </span>
      </Title>

      <div
        style={{
          display: "flex",
          gap: "64px",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        <div style={{ flex: 2 }}>
          <div></div>
          <Flex justify="space-between">
            <Button
              type="primary"
              onClick={() => showNewModal()}
              style={{ marginBottom: "10px", alignSelf: "flex-end" }}
            >
              创建检测区域
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
                setSelectedArea(null);
              }}
              value={selectedCamera?.name}
            ></Select>
          </Flex>
          <Table
            rowSelection={{
              selectedRowKeys: [selectedArea?.id],
              type: "radio",
              onChange: (keys, rows) => {
                if (rows[0]) {
                  setSelectedArea(rows[0]);
                } else {
                  setSelectedArea(null);
                }
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
            {selectedArea ? (
              <>
                <PolygonCanv
                  key={"polygoncanv" + selectedArea.id}
                  videoWidth={selectedCamera.frame_width}
                  data={selectedArea.coordinates}
                ></PolygonCanv>
                <CrossLinesCanv
                  key={"crosslinescanv" + selectedArea.id}
                  videoWidth={selectedCamera.frame_width}
                  data={selectedArea.algoparam.cross_line}
                ></CrossLinesCanv>
                <CrossDirectionCanv
                  key={"crossdirectioncanv" + selectedArea.id}
                  videoWidth={selectedCamera.frame_width}
                  data={selectedArea.algoparam.cross_direction}
                ></CrossDirectionCanv>
              </>
            ) : null}
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
            key={editingArea ? "areaeditor" + editingArea.id : null}
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
            key={editingArea ? "algoeditor" + editingArea.id : null}
            area={editingArea}
            onUpdate={handleUpdate}
          />
        </div>
      </Modal>
    </div>
  );
};

export default Areas;

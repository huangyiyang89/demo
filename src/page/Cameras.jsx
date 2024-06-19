import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Typography,
  Popconfirm,
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import { useLocation } from "react-router-dom";
import axios from "axios";

const { Title } = Typography;
const { Option } = Select;

const Cameras = () => {
  const [cameras, setCameras] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCamera, setCurrentCamera] = useState(null);
  const [form] = Form.useForm();
  const location = useLocation();

  useEffect(() => {
    fetchCameras();
    if (location.state?.openModal) {
      setCurrentCamera(null);
      setIsEditing(false);
      form.setFieldsValue({});
      setIsModalOpen(true);
    }
  }, [location.state, form]);

  const fetchCameras = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/device/cameras"
      );
      setCameras(response.data);
    } catch (error) {
      console.error("获取摄像机数据失败:", error);
      message.error("获取摄像机数据失败");
    }
  };

  const showModal = (camera = null) => {
    setCurrentCamera(camera);
    setIsEditing(!!camera);
    form.setFieldsValue(camera || {});
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing) {
        await axios.post(
          `http://127.0.0.1:8000/api/device/cameras?Camera_id=${values.Camera_id}`,
          values
        );
        setCameras(
          cameras.map((camera) => (camera.Camera_id === values.Camera_id ? values : camera))
        );
        message.success("摄像机更新成功！");
      } else {
        const response = await axios.post(
          "http://127.0.0.1:8000/api/device/creatCamera",
          values
        );
        const newCamera = response.data
        setCameras([...cameras, newCamera]);
        message.success("摄像机添加成功！");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.error(error);
      message.error("提交表单失败");
    }
  };

  const handleDelete = async (Camera_id) => {
    try {
      await axios.post(`http://localhost:8000/api/device/deleteCamera?camera_id=${Camera_id}`);
      setCameras(cameras.filter((camera) => camera.Camera_id !== Camera_id));
      message.success("摄像机删除成功");
    } catch (error) {
      console.error("删除摄像机失败:", error);
      message.error("删除摄像机失败");
    }
  };

  const columns = [
    { title: "摄像机编号", dataIndex: "Camera_id", key: "Camera_id" },
    { title: "摄像机名称", dataIndex: "name", key: "Camera_id" },
    { title: "描述", dataIndex: "description", key: "Camera_id" },
    { title: "源地址", dataIndex: "Camera_addr", key: "Camera_id" },
    { title: "状态", dataIndex: "state", key: "Camera_id" },
    { title: "宽", dataIndex: "frame_width", key: "Camera_id" },
    { title: "高", dataIndex: "frame_height", key: "Camera_id" },
    { title: "MAC", dataIndex: "MAC", key: "Camera_id" },
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
            description="删除后数据无法恢复"
            onConfirm={() => handleDelete(record.Camera_id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button
              type="primary"
              size="small"
              style={{ marginLeft: "8px" }}
              danger
            >
              删除
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>摄像机设置</Title>
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        添加摄像机
      </Button>
      <Table
        columns={columns}
        dataSource={cameras.filter((camera) => camera.state !== "deleted")}
        rowKey="id"
      />
      <Modal
        title={isEditing ? "编辑摄像机" : "添加摄像机"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="Camera_id" label="摄像机编号" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="摄像机名称"
            rules={[{ required: true, message: "请输入摄像机名称!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: "请输入描述!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Camera_addr"
            label="源地址"
            rules={[{ required: true, message: "请输入源地址!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="frame_width"
            label="宽"
            rules={[{ required: true, message: "请输入宽!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="frame_height"
            label="高"
            rules={[{ required: true, message: "请输入高!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="MAC"
            label="MAC地址"
            rules={[{ required: true, message: "请输入MAC地址!" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Cameras;

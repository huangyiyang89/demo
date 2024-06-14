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
import { get_cameras } from "../mock";
const { Title } = Typography;
const { Option } = Select;

const Cameras = () => {
  const [cameras, setCameras] = useState(get_cameras);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCamera, setCurrentCamera] = useState(null);
  const [form] = Form.useForm();

  //带状态跳转
  const location = useLocation();
  useEffect(() => {
    if (location.state?.openModal) {
      setCurrentCamera(null);
      setIsEditing(false);
      form.setFieldsValue({});
      setIsModalOpen(true);
    }
  }, [location.state, form]);

  const showModal = (camera = null) => {
    setCurrentCamera(camera);
    setIsEditing(!!camera);
    form.setFieldsValue(camera || {});
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEditing) {
          setCameras(
            cameras.map((camera) => (camera.id === values.id ? values : camera))
          );
          message.success("摄像机更新成功！");
        } else {
          const newCamera = { ...values, id: cameras.length + 1 };
          setCameras([...cameras, newCamera]);
          message.success("摄像机添加成功！");
        }
        setIsModalOpen(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("填写有误:", info);
      });
  };

  const handleDelete = (id) => {
    setCameras(cameras.filter((camera) => camera.id !== id));
    message.success("Camera deleted successfully");
  };

  const columns = [
    { title: "摄像机编号", dataIndex: "id", key: "id" },
    { title: "摄像机名称", dataIndex: "name", key: "name" },
    { title: "描述", dataIndex: "description", key: "description" },
    { title: "源地址", dataIndex: "ip", key: "ip" },
    { title: "状态", dataIndex: "state", key: "state" },
    {
      title: "操作",
      key: "action",
      render: (text, record) => (
        <span>
          <Button type="primary" onClick={() => showModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            description="删除后数据无法恢复"
            onConfirm={() => handleDelete(record.id)}
            icon={
              <QuestionCircleOutlined
                style={{
                  color: "red",
                }}
              />
            }
          >
            <Button type="primary" style={{ marginLeft: "8px" }} danger>
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
        onClick={showModal}
        style={{ marginTop: "20px", marginBottom: "10px" }}
      >
        添加摄像机
      </Button>
      <Table
        columns={columns}
        dataSource={cameras.filter((camera) => camera.state != "deleted")}
        rowKey="id"
      />
      <Modal
        title={isEditing ? "编辑摄像机" : "添加摄像机"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="摄像机编号" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="摄像机名称"
            rules={[{ required: true, message: "Please input the name!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="描述"
            rules={[
              { required: true, message: "Please input the description!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="ip"
            label="源地址"
            rules={[{ required: true, message: "Please input the source!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="state"
            label="状态"
            rules={[{ required: true, message: "请选择状态！" }]}
          >
            <Select>
              <Option value="启用">启用</Option>
              <Option value="停用">停用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Cameras;

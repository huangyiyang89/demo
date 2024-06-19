import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Typography
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";

const { Title } = Typography;
const { Option } = Select;

const Areas = () => {
  const [areas, setAreas] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArea, setCurrentArea] = useState(null);
  const [form] = Form.useForm();
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/device/areas", {
        method: "POST",
      });
      const data = await response.json();
      setAreas(data);
    } catch (error) {
      console.error("Failed to fetch areas:", error);
    }
  };

  const showModal = (area = null) => {
    setCurrentArea(area);
    setIsEditing(!!area);
    form.setFieldsValue(area || {});
    setIsModalOpen(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      if (isEditing) {
        await fetch("http://127.0.0.1:8000/api/device/updateArea", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        setAreas(areas.map((area) => (area.id === values.id ? values : area)));
        message.success("区域更新成功！");
      } else {
        const response = await fetch("http://127.0.0.1:8000/api/device/createArea", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });
        const newArea = await response.data;
        setAreas([...areas, newArea]);
        message.success("区域添加成功！");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      console.log("填写有误:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/api/device/deleteArea?area_id=${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      setAreas(areas.filter((area) => area.id !== id));
      message.success("区域删除成功！");
    } catch (error) {
      console.error("Failed to delete area:", error);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "名称", dataIndex: "name", key: "id" },
    { title: "摄像机ID", dataIndex: "Camera_id", key: "id" },
    { title: "坐标", dataIndex: "area_coordinate", key: "id" },
    { title: "事件类型", dataIndex: "event_type", key: "id" },
    { title: "区域类型", dataIndex: "area_type", key: "id" },
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
            onConfirm={() => handleDelete(record.id)}
            icon={<QuestionCircleOutlined style={{ color: "red" }} />}
          >
            <Button type="primary" size="small" danger style={{ marginLeft: "8px" }}>
              删除
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <Title level={4}>区域设置</Title>
      <Input
        placeholder="筛选"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        style={{ marginBottom: "10px", width: "300px",marginRight:"50px" }}
      />
      <Button
        type="primary"
        onClick={() => showModal()}
        style={{ marginBottom: "10px",alignSelf:"flex-end" }}
      >
        添加区域
      </Button>
      <Table
        columns={columns}
        dataSource={areas.filter((area) => area.name.includes(filter))}
        rowKey="id"
      />
      <Modal
        title={isEditing ? "编辑区域" : "添加区域"}
        visible={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="ID" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label="名称"
            rules={[{ required: true, message: "请输入名称！" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="Camera_id"
            label="摄像机ID"
            rules={[{ required: true, message: "请输入摄像机ID！" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="area_coordinate"
            label="坐标"
            rules={[{ required: true, message: "请输入坐标！" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="event_type"
            label="事件类型"
            rules={[{ required: true, message: "请输入事件类型！" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="area_type"
            label="区域类型"
            rules={[{ required: true, message: "请输入区域类型！" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="time"
            label="时间"
            rules={[{ required: true, message: "请输入时间！" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Areas;

import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Typography,
  Popconfirm,
  Tag
} from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const Nvrs = () => {
  const [nvrs, setNvrs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  const refreshData = async () => {
    try {
      const response = await axios.get("/api/nvrs/");
      const nvrs = response.data;
      console.log("nvrs:", nvrs);
      setNvrs(nvrs);
    } catch (error) {
      if (error.response.status==500) {
        message.error("服务器未响应，拉取 NVR 列表失败！");
      } else {
        message.error(error.response.data.message);
      }
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      if (isEditing) {
        await axios.patch(`/api/nvrs/${values.id}`, values);
        setNvrs(nvrs.map((nvr) => (nvr.id === values.id ? values : nvr)));
        message.success("NVR 更新成功！");
      } else {
        const response = await axios.post("/api/nvrs/", values);
        setNvrs([...nvrs, response.data]);
        message.success("添加 NVR 成功！");
      }
      setIsModalOpen(false);
      form.resetFields();
    } catch (error) {
      if (error.response.status==500) {
        message.error("服务器未响应，提交数据失败！");
      } else {
        message.error(error.response.data.message);
      }
    }
  };

  const handleDeleteNvr = async (id) => {
    try {
      await axios.delete(`/api/nvrs/${id}`);
      setNvrs(nvrs.filter((nvr) => nvr.id !== id));
      message.success("NVR删除成功");
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.detail);
      } else {
        message.error(error.message);
      }
    }
  };
  const columns = [
    {
      title: "MAC 地址",
      dataIndex: "mac",
      key: "mac",
      ellipsis: true,
      width: "30%",
    },
    {
      title: "IP 地址",
      dataIndex: "ip",
      key: "ip",
      ellipsis: true,
      width: "30%",
    },
    {
      title: "品牌",
      dataIndex: "brand",
      key: "brand",
      ellipsis: true,
      width: "20%",
    },
    {
      title: "状态",
      dataIndex: "state",
      key: "state",
      ellipsis: true,
      width: "10%",
      render: (text, record) => (
        <Tag color={record.state === 1 ? "green" : "red"}>
          {record.state === 1 ? "在线" : "离线"}
        </Tag>
      ),
    },
    {
      title: "操作",
      key: "action",
      width: 150,
      render: (text, record) => (
        <div>
          <Button type="primary" size="small" onClick={() => showModal(record)}>
            编辑
          </Button>
          <Popconfirm
            title="确认删除？"
            description="是否真的要删除该 NVR ?"
            onConfirm={() => handleDeleteNvr(record.id)}
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
        </div>
      ),
    },
  ];

  const showModal = (nvr = null) => {
    setIsEditing(!!nvr);
    form.resetFields();
    form.setFieldsValue(nvr || {});
    setIsModalOpen(true);
  };

  return (
    <>
      <Title level={4}>NVR 设置</Title>
      <div
        style={{
          gap: "64px",
          marginTop: "20px",
          marginBottom: "10px",
        }}
      >
        <Button type="primary" onClick={() => showModal()}>
          添加 NVR
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={nvrs.filter((camera) => camera.state !== "deleted")}
        rowKey="id"
      />
      <Modal
        title={isEditing ? "编辑 NVR" : "添加 NVR"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="id" label="摄像机编号" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            name="brand"
            label="NVR 品牌"
            rules={[{ required: true, message: "请输入品牌!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="ip"
            label="NVR IP 地址"
            rules={[
              { required: true, message: "请输入 ip 地址!" },
              {
                pattern:
                  "^((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$",
                message: "请输入有效的 ip 地址!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="mac"
            label="MAC 地址"
            rules={[
              { required: true, message: "请输入 MAC 地址!" },
              {
                pattern: "^([0-9a-f]{2}(:|-)){5}[0-9a-f]{2}$",
                message: "请输入正确的mac地址！全部为小写字母，以冒号分割如 a1:b2:c3:d4:f5:66",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Nvrs;

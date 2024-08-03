import { Form, message, InputNumber, Button } from "antd";
import PropTypes from "prop-types";
import { stringToArray } from "../service";
import axios from "axios";

const AlgoEditor = ({ area, onUpdate }) => {
  const [form] = Form.useForm();

  const shouldHidden = (eventtype_id) => {
    if (!area?.algoparam?.eventtype_ids) {
      return true;
    }
    const ids = stringToArray(area?.algoparam?.eventtype_ids);
    if (ids.includes(eventtype_id)) {
      return false;
    } else {
      return true;
    }
  };

  // 处理表单字段变化的函数
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    // 在这里，你可以根据需要更新数据状态或执行其他逻辑
  };

  // 提交表单时的处理函数
  const onFinish = async (values) => {
    try {
      const response = await axios.patch(`/api/algoparams/${area.algoparam.id}`, values);
      message.success("数据更新成功");
      console.log("patch_response:",response.data)
      onUpdate(response.data);
    } catch (error) {
      if (error.response) {
        message.error(error.response.data.detail);
      } else {
        message.error(error.message);
      }
    }
  };

  const inputStlye = {
    width: "100%",
  };

  return (
    <div>
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={area?.algoparam}
        onFinish={onFinish}
        onChange={handleChange}
      >
        <Form.Item label="NMS值" name="nms_thresh">
          <InputNumber
            step={"0.1"}
            max={"1"}
            min={"0"}
            style={inputStlye}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="人体检测阈值"
          name="people_score_thresh"
          hidden={shouldHidden("1201")}
        >
          <InputNumber
            step={"0.1"}
            max={"1"}
            min={"0"}
            style={inputStlye}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="人脸检测阈值"
          name="face_score_thresh"
          hidden={shouldHidden("1201")}
        >
          <InputNumber
            step={"0.1"}
            max={"1"}
            min={"0"}
            style={inputStlye}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="人头检测阈值"
          name="head_score_thresh"
          hidden={shouldHidden("1201")}
        >
          <InputNumber
            step={"0.1"}
            max={"1"}
            min={"0"}
            style={inputStlye}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="安全帽检测阈值"
          name="helmet_score_thresh"
          hidden={shouldHidden("1401")}
        >
          <InputNumber
            step={"0.1"}
            max={"1"}
            min={"0"}
            style={inputStlye}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="烟火检测阈值"
          name="fire_score_thresh"
          hidden={shouldHidden("2101")}
        >
          <InputNumber
            step={"0.1"}
            max={"1"}
            min={"0"}
            style={inputStlye}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="积水检测阈值"
          name="water_score_thresh"
          hidden={shouldHidden("2102")}
        >
          <InputNumber
            step={"0.1"}
            max={"1"}
            min={"0"}
            style={inputStlye}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="跌倒检测阈值"
          name="falldown_score_thresh"
          hidden={shouldHidden("1501")}
        >
          <InputNumber
            step={"0.1"}
            max={"1"}
            min={"0"}
            style={inputStlye}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="交并比"
          name="iou_cost_weight"
          hidden={shouldHidden("1202")}
        >
          <InputNumber
            step={"0.1"}
            max={"1"}
            min={"0"}
            style={inputStlye}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="成本阈值"
          name="cost_th"
          hidden={shouldHidden("1202")}
        >
          <InputNumber
            step={"0.1"}
            max={"1"}
            min={"0"}
            style={inputStlye}
          ></InputNumber>
        </Form.Item>
        <Form.Item
          label="最大不匹配次数"
          name="max_mismatch_times"
          hidden={shouldHidden("1202")}
        >
          <InputNumber
            step={"1"}
            max={"100"}
            min={"0"}
            style={inputStlye}
          ></InputNumber>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 24 }}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

AlgoEditor.propTypes = {
  area: PropTypes.object,
  onUpdate: PropTypes.func.isRequired,
};

export default AlgoEditor;

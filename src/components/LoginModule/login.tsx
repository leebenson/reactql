import React from "react";
import Form from "antd/es/form/Form";
import { Input } from "antd";
import Checkbox from "antd/es/checkbox";
import { Button } from "antd/es";
import Select from "antd/es/select";
import Avatar from "antd/es/avatar";
import { SettingTwoTone } from "@ant-design/icons/lib";

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 }
};

const onFinish = values => {
  console.log("Success:", values);
};

const onFinishFailed = errorInfo => {
  console.log("Failed:", errorInfo);
};

const { Option } = Select;

const Login: React.FunctionComponent = () => (
  <div className={`login`}>
    <Avatar size={84} icon={<SettingTwoTone spin={true} />} />
    <Form
      {...layout}
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Username"
        name="username"
        rules={[{ required: true, message: "Please input your username!" }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input your password!" }]}
      >
        <Input.Password />
      </Form.Item>

      <Form.Item name="role" label="Role" rules={[{ required: true }]}>
        <Select placeholder="Select Role">
          <Option value="admin">Admin</Option>
          <Option value="author">Author</Option>
          <Option value="reviewer">Reviewer</Option>
        </Select>
      </Form.Item>

      <Form.Item {...tailLayout} name="remember" valuePropName="checked">
        <Checkbox>Remember me</Checkbox>
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  </div>
);

export default Login;

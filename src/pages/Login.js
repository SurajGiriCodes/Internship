import React, { useContext, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";
import classes from "./login.module.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // const { loginUser } = useAuth();

  const onFinish = async (values) => {
    // Call loginUser with the form values
    // loginUser(values.email, values.password);
    console.log(values);
  };

  return (
    <div className={classes.center}>
      <h2>Log in</h2>
      <Form
        name="normal_login"
        className={classes["login-form"]}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
      >
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className={classes["site-from-item-icon"]} />}
            placeholder="Email"
          />
        </Form.Item>

        {/* <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className={classes["site-from-item-icon"]} />}
            type="username"
            placeholder="username"
          />
        </Form.Item> */}

        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className={classes["site-from-item-icon"]} />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={classes["login-form-button"]}
          >
            Log in
          </Button>
          <div className={classes.register}>
            <span>Forget Password</span>{" "}
            <a href="" style={{ color: "DodgerBlue" }}>
              Click here!
            </a>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;

// profix = It allows you to add a visual element (typically an icon) before the input or element.

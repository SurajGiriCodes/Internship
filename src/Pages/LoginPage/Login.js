import { Button, Form, Input } from "antd";
import classes from "./login.module.css";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await fetch("https://core.school.wtech.com.np/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: values.username,
          password: values.password,
        }),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          // Set individual field errors
          const fieldErrors = [];
          if (errorData.username) {
            fieldErrors.push({
              name: "username",
              errors: [errorData.username],
            });
          }
          if (errorData.password) {
            fieldErrors.push({
              name: "password",
              errors: [errorData.password],
            });
          }
          form.setFields(fieldErrors);
        } else if (response.status === 401) {
          // Logic for handling incorrect username or password
          form.setFields([
            {
              name: "username",
              errors: [""],
            },
            {
              name: "password",
              errors: ["Incorrect username or password"], // Show error under password field
            },
          ]);
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return;
      }

      const data = await response.json();

      // Store the token in local storage
      localStorage.setItem("accessToken", data.access);
      console.log("Login successful! Redirecting to dashboard...");

      // Redirect to the dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("There was an error!", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={classes.loginContainer}>
      <div className={classes.leftSection}></div>
      <div className={classes.rightSection}>
        <div className={classes.center}>
          <h2
            style={{
              fontFamily: "Roboto, sans-serif",
              fontSize: "35px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "110%",
              marginLeft: "-32px",
            }}
          >
            School Management
          </h2>
          <Form
            form={form}
            name="normal_login"
            className={classes["login-form"]}
            initialValues={{
              remember: true,
            }}
            onFinish={onFinish}
            layout="vertical"
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
              label="Username"
              className={classes.formItemCustom}
            >
              <Input placeholder="Username" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
              label="Password"
              className={classes.formItemCustom}
            >
              <Input.Password
                placeholder="Password"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className={classes.loginFormButton}
                loading={loading}
                style={{ width: "100%", height: "40px", fontSize: "16px" }}
              >
                Log in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;

import React, { useContext, useEffect, useState } from "react";
import { Button, Form, Input, message } from "antd";
import classes from "./create.module.css";
import { useUser } from "../../context/UserContext";
import { Link } from "react-router-dom";
import { API_URL } from "../../ApiConfig";

export default function Create() {
  const { editData } = useUser();
  // console.log(editData);
  const [form] = Form.useForm(); //creating a form instance using Form.useForm() and assigning it to the form variable.

  const createList = async (data) => {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data), // Send data directly, not within an object
    });
    const responseData = await response.json();
    console.log("Data created successfully:", responseData);
    form.resetFields();
  };

  const updateList = async (id, data) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Data updated successfully:", responseData);
      } else {
        console.error("Error updating data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the update:", error);
    }
    form.resetFields();
  };

  const onFinish = async (values) => {
    if (editData) {
      updateList(editData._id, values);
      message.success("Form edited successfully");
    } else {
      createList(values);
      message.success("Form submitted successfully");
    }

    setTimeout(() => {
      message.destroy();
    }, 4000);
  };

  //populating the form fields with the data from editData
  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    }
  }, [editData, form]); //effect should be triggered when either editData or form changes.

  return (
    <div className={classes.center}>
      <h2>{editData ? "Edit" : "Add"}</h2>

      <Form
        name="normal_add"
        className={classes["add-form"]}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        form={form}
      >
        <Form.Item
          name="firstName"
          label="First name:"
          rules={[
            {
              required: true,
              message: "Require",
            },
          ]}
        >
          <Input placeholder="first name" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Last name:"
          rules={[
            {
              required: true,
              message: "Require",
            },
          ]}
        >
          <Input placeholder="last name" />
        </Form.Item>

        <Form.Item
          name="age"
          label="Age:"
          rules={[
            {
              required: true,
              message: "Require",
            },
          ]}
        >
          <Input placeholder="age" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Address:"
          rules={[
            {
              required: true,
              message: "Require",
            },
          ]}
        >
          <Input placeholder="address" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={classes["add-button"]}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>

      <Link to="/">
        <Button type="primary" className={classes["back-button"]}>
          Go Back to List
        </Button>
      </Link>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import { Space, Table, Modal, Button, Input, Form, message } from "antd";
import classes from "./table.module.css";
import { API_URL } from "../ApiConfig";

const { Column, ColumnGroup } = Table; //destructuring the Column component from the Table component.

const StuTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [createdData, setCreatedData] = useState([]);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const responseData = await response.json();
      setCreatedData(responseData);
    } catch (error) {
      console.error("Error fetching created data:", error);
    }
  };

  //DELETE
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const showDeleteModal = (record) => {
    Modal.confirm({
      title: "Delete Confirmation",
      content: "Are you sure you want to delete this item?",
      onOk: () => handleDelete(record._id),
    });
  };

  const openModal = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditData(null);
  };

  //on from submit
  const onFinish = async (values) => {
    if (editData) {
      updateList(editData._id, values);
      message.success("Edit successfully");
    } else {
      createList(values);
      message.success("Successfully Added");
    }

    setTimeout(() => {
      message.destroy();
    }, 3000);

    setIsModalVisible(false);
    setEditData(null);
  };

  //POST
  const createList = async (data) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data), // Send data directly, not within an object
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Data created successfully:", responseData);
        form.resetFields();
        setIsModalVisible(false);
        fetchData();
      } else {
        console.error("Error creating data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the create:", error);
    }
  };

  //PUT
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
        const responseData = response.body;
        console.log("Data updated successfully:", responseData);
        form.resetFields();
        setIsModalVisible(false); // Close the modal
        fetchData(); // Refresh the table
      } else {
        console.error("Error updating data:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred during the update:", error);
    }
  };

  //populating the form fields with the data from editData
  useEffect(() => {
    if (editData) {
      form.setFieldsValue(editData);
    }
  }, [editData, form]); //effect should be triggered when either editData or form changes.

  return (
    <div className={classes.Maintable}>
      <Button type="primary" className={classes.createbtn} onClick={openModal}>
        Create
      </Button>

      {/* MODULE */}
      <Modal
        title={editData ? "Edit Entry" : "Create New Entry"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        {/* FROM */}
        <Form form={form} onFinish={onFinish}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[{ required: true, message: "Please enter first name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: "Please enter last name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: "Please enter age" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: "Please enter address" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Table */}
      <Table
        dataSource={createdData.map((item, index) => ({ ...item, key: index }))}
      >
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" />
        <Column title="Age" dataIndex="age" key="age" />
        <Column title="Address" dataIndex="address" key="address" />

        <ColumnGroup
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <Button
                type="primary"
                style={{ background: "#7cb305", borderColor: "#7cb305" }}
                onClick={() => {
                  setEditData(record);
                  openModal(record);
                }}
              >
                Edit
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => showDeleteModal(record)}
              >
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default StuTable;

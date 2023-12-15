import React, { useEffect, useState } from "react";
import {
  Space,
  Table,
  Modal,
  Button,
  Input,
  Form,
  message,
  ConfigProvider,
} from "antd";
import classes from "./table.module.css";
import { API_URL } from "../ApiConfig";
import { useTheme } from "../ThemeProvider";

const { Column, ColumnGroup } = Table; //destructuring the Column component from the Table component.

const StuTable = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [createdData, setCreatedData] = useState([]);
  const [editData, setEditData] = useState(null);
  const [pageSize, setPageSize] = useState(5); // Number of items to display per page
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const { theme } = useTheme();

  useEffect(() => {
    fetchData();
  }, [currentPage, pageSize]);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const responseData = await response.json();
      setCreatedData(responseData);
    } catch (error) {
      console.error("Error fetching created data:", error);
    }
  };

  //updating the createdData state with the filtered data.
  const updateFromData = (data) => {
    setCreatedData(data);
  };

  //DELETE
  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      updateFromData(createdData.filter((item) => item._id !== id)); //If the _id of the item is not equal to idToRemove, it includes that item in the filteredItems array
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

        // Update the component state with the newly created data
        setCreatedData([...createdData, responseData]);

        form.resetFields();
        setIsModalVisible(false);
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
        const responseData = await response.json();
        console.log("Data updated successfully:", responseData);

        //Update the component state with the updated data
        updateFromData(
          createdData.map((item) => (item._id === id ? responseData : item))
        );

        form.resetFields();
        setIsModalVisible(false);
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size, page) => {
    setCurrentPage(1); // Reset the current page to the first page when changing page size
    setPageSize(size);
  };

  // Define the pagination configuration
  const pagination = {
    pageSize, // Number of items to display per page
    current: currentPage, // Current page
    total: createdData.length, // Total number of items
    onChange: handlePageChange, // Handle page change
    onShowSizeChange: handlePageSizeChange, // Handle page size change
  };

  const lightTheme = {
    colorBgBase: "white",
    colorTextBase: "black",
  };

  const darkTheme = {
    colorBgBase: "rgba(0, 0, 0, 0.85)",
    colorTextBase: "#ffccc7",
    Button: "red",
    backgroundColor: "#007bff",
  };

  return (
    <>
      <div className={classes.Maintable}>
        {/* Table */}
        <ConfigProvider
          theme={{
            token: theme === "dark" ? darkTheme : lightTheme,
          }}
        >
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

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              type="primary"
              className={classes.createbtn}
              onClick={openModal}
              style={{
                backgroundColor: theme === "dark" ? "#820014" : "#007bff",
              }}
            >
              Create
            </Button>
          </div>

          <Table
            dataSource={createdData.map((item, index) => ({
              ...item,
              key: index,
            }))}
            pagination={pagination}
            style={{
              borderColor: theme === "dark" ? "white" : "black", // Set the border color based on the theme
            }}
            scroll={{ y: true }}
          >
            <Column
              title="First Name"
              dataIndex="firstName"
              key="firstName"
              style={{ backgroundColor: "red" }}
            />
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
                    style={{
                      background: "none",
                      color:
                        theme === "dark"
                          ? darkTheme.colorTextBase
                          : lightTheme.colorTextBase,
                    }}
                    onClick={() => {
                      setEditData(record);
                      openModal(record);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    type="primary"
                    style={{
                      background: "none",
                      color: theme === "dark" ? darkTheme.colorTextBase : "red",
                    }}
                    danger
                    onClick={() => showDeleteModal(record)}
                  >
                    Delete
                  </Button>
                </Space>
              )}
            />
          </Table>
        </ConfigProvider>
      </div>
    </>
  );
};

export default StuTable;

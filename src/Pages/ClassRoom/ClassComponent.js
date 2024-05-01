import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Input,
  Form,
  notification,
  Select,
} from "antd";

export default function ClassComponent({ onClassesChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [modalMode, setModalMode] = useState("Add");

  const postClassData = async (ClassData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const url = "https://core.school.wtech.com.np/api/school/schoolclass/";
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(ClassData),
      };

      const response = await fetch(url, requestOptions);
      // return response.json();
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Failed to add shift:", error);
      notification.error({
        message: "Failed to Add Shift",
        duration: 3,
      });
    }
  };

  //FETCH THE DATA IN TABLE
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://core.school.wtech.com.np/api/school/schoolclass/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setData(result.map((item, index) => ({ ...item, key: index })));
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  //FETCH THE DATA IN TABLE
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://core.school.wtech.com.np/api/school/predefinedclass/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        setClassOptions(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  //EDIT Shift
  const updateClass = async (formattedValues, ClassId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const url = `https://core.school.wtech.com.np/api/school/schoolclass/${ClassId}/`;
    const requestOptions = {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formattedValues),
    };

    const response = await fetch(url, requestOptions);
    return response.json();
  };

  // DELETE RECORD
  const deleteClass = async (id) => {
    const accessToken = localStorage.getItem("accessToken");
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await fetch(
        `https://core.school.wtech.com.np/api/school/schoolclass/${id}/`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      notification.success({
        message: "Shift deleted Successfully",
        duration: 3,
      });

      // Update the state to remove the deleted item
      setData(data.filter((item) => item.id !== id));
      onClassesChange();
    } catch (error) {
      console.error("Failed to delete shift:", error);
      notification.error({
        message: "Failed to delete Shift",
        duration: 3,
      });
    }
  };

  const columns = [
    {
      title: "Class Name",
      dataIndex: "predefined_class_name",
      key: "predefined_class_name",
    },
    {
      title: "Action",
      Key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showEditModal(record)}>Edit</a>
          <a onClick={() => deleteClass(record.id)} style={{ color: "red" }}>
            Delete
          </a>
        </Space>
      ),
    },
  ];

  const [editingClass, setEditingClass] = useState(null);

  //open midel in Add mode
  const showAddModal = () => {
    setEditingClass(null);
    form.resetFields();
    setModalMode("Add");
    setIsModalOpen(true);
  };

  //open midel in Add mode
  const showEditModal = (classItem) => {
    setEditingClass(classItem);
    form.setFieldsValue({
      predefined_class_id: classItem.predefined_class_id,
    });
    setModalMode("Edit");
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        console.log(values);
        setLoading(true);
        try {
          let updatedClass;
          const classData = {
            predefined_class_id: values.predefined_class_id,
          };
          if (editingClass) {
            updatedClass = await updateClass(values, editingClass.id);
            setData(
              data.map((shift) =>
                shift.id === editingClass.id ? updatedClass : shift
              )
            );
            onClassesChange();
            notification.success({
              message: "Shift Updated Successfully",
              duration: 3,
            });
          } else {
            const newClass = await postClassData(classData);
            setData([...data, { ...newClass, key: data.length }]);
            onClassesChange();
            notification.success({
              message: "Shift Added Successfully",
              duration: 3,
            });
          }
        } catch (error) {
          console.error("Error processing shift:", error);
          notification.error({
            message: "Failed to Process Shift",
            duration: 3,
          });
        } finally {
          setLoading(false);
          setIsModalOpen(false);
          setEditingClass(null);
          form.resetFields();
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
        setLoading(false);
      });
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <div>
      <Button
        type="primary"
        style={{
          marginBottom: 16,
        }}
        onClick={showAddModal}
      >
        Add Class
      </Button>
      <Modal
        title={`${modalMode} Class`}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="Cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            {modalMode}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical" name="form_in_modal">
          <Form.Item name="predefined_class_id" label="Class Name">
            <Select placeholder="Select a class name">
              {classOptions.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={data}
        columns={columns.map((col) => ({
          ...col,
        }))}
        loading={loading}
      />
    </div>
  );
}

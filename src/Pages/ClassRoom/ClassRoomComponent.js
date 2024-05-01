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

export default function ClassRoomComponent({ shifts, classes }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [shiftOptions, setShiftOptions] = useState([]);
  const [modalMode, setModalMode] = useState("Add");

  const postData = async (ClassData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }

      const url = "https://core.school.wtech.com.np/api/school/classroom/";
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

  useEffect(() => {
    setShiftOptions(shifts);
    setClassOptions(classes);
  }, [shifts, classes]);

  //FETCH THE DATA IN TABLE
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://core.school.wtech.com.np/api/school/classroom/",
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

  //EDIT Shift
  const updateClassRoom = async (formattedValues, EditId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    const url = `https://core.school.wtech.com.np/api/school/classroom/${EditId}/`;
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
  const deleteClassRoom = async (id) => {
    const accessToken = localStorage.getItem("accessToken");
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await fetch(
        `https://core.school.wtech.com.np/api/school/classroom/${id}/`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      notification.success({
        message: "Shift deleted Successfully",
        duration: 3,
      });
      setData(data.filter((item) => item.id !== id));
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
      title: "Shift Name",
      dataIndex: "shift_name",
      key: "shift_name",
    },
    {
      title: "Class Name",
      dataIndex: "predefined_class_name",
      key: "predefined_class_name",
    },
    {
      title: "Section",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Action",
      Key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showEditModal(record)}>Edit</a>
          <a
            onClick={() => deleteClassRoom(record.id)}
            style={{ color: "red" }}
          >
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
  const showEditModal = (ClassRoom) => {
    setEditingClass(ClassRoom);
    form.setFieldsValue({
      name: ClassRoom.name,
      predefined_class_id: ClassRoom.ay_class_id,
      shift_id: ClassRoom.ay_shift_id,
    });
    setModalMode("Edit");
    setIsModalOpen(true);
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        console.log(values);

        const apiData = {
          ay_shift_id: values.shift_id,
          ay_class_id: values.predefined_class_id,
          name: values.name,
        };
        setLoading(true);
        try {
          let updatedClassR;
          if (editingClass) {
            updatedClassR = await updateClassRoom(apiData, editingClass.id);
            setData(
              data.map((item) =>
                item.id === editingClass.id ? updatedClassR : item
              )
            );
            notification.success({
              message: "Classroom Updated Successfully",
              duration: 3,
            });
          } else {
            const newClass = await postData(apiData);
            setData([...data, { ...newClass, key: data.length }]);
            notification.success({
              message: "Class Room Added Successfully",
              duration: 3,
            });
          }
        } catch (error) {
          console.error("Error processing class Room:", error);
          notification.error({
            message: "Failed to Process Class Room",
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
        Add Class Room
      </Button>
      <Modal
        title={`${modalMode} Class Room`}
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
        <Form form={form} layout="horizontal" name="form_in_modal">
          <Form.Item name="predefined_class_id" label="Class Name">
            <Select placeholder="Select a class name">
              {classOptions.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.predefined_class_name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="shift_id" label="Shift Name">
            <Select placeholder="Select a Shift name">
              {shiftOptions.map((option) => (
                <Select.Option key={option.id} value={option.id}>
                  {option.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="Section Name"
            rules={[
              {
                message: "Please Enter the name of the Section!",
              },
            ]}
          >
            <Input />
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

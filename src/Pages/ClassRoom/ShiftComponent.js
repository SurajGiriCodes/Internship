import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Input, Form, notification } from "antd";

export default function ShiftComponent({ onShiftsChange }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [modalMode, setModalMode] = useState("Add");

  const postShiftData = async (shiftData) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token found");
      }
      const url = "https://core.school.wtech.com.np/api/school/schoolshift/";
      const requestOptions = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(shiftData),
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

  //FETCH THE DATA IN TABLE
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          "https://core.school.wtech.com.np/api/school/schoolshift/",
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
  const updateShift = async (formattedValues, shiftId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const url = `https://core.school.wtech.com.np/api/school/schoolshift/${shiftId}/`;
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
  const deleteShift = async (id) => {
    const accessToken = localStorage.getItem("accessToken");
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    try {
      const response = await fetch(
        `https://core.school.wtech.com.np/api/school/schoolshift/${id}/`,
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
      onShiftsChange();
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
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Action",
      Key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => showEditModal(record)}>Edit</a>
          <a onClick={() => deleteShift(record.id)} style={{ color: "red" }}>
            Delete
          </a>
        </Space>
      ),
    },
  ];

  const [editingShift, setEditingShift] = useState(null);

  //open midel in Add mode
  const showAddModal = () => {
    setEditingShift(null);
    form.resetFields();
    setIsModalOpen(true);
    setModalMode("Add");
  };

  //open midel in Add mode
  const showEditModal = (shift) => {
    setEditingShift(shift);
    form.setFieldsValue({ name: shift.name });
    setIsModalOpen(true);
    setModalMode("Edit");
  };

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setLoading(true);
        try {
          let updatedShift;
          if (editingShift) {
            updatedShift = await updateShift(values, editingShift.id);
            setData(
              data.map((shift) =>
                shift.id === editingShift.id ? updatedShift : shift
              )
            );
            onShiftsChange();
            notification.success({
              message: "Shift Updated Successfully",
              duration: 3,
            });
          } else {
            updatedShift = await postShiftData(values);
            setData([...data, updatedShift]);
            onShiftsChange();
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
          setEditingShift(null);
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
        Add Shift
      </Button>
      <Modal
        title={`${modalMode} Shift`}
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
          <Form.Item
            name="name"
            label="Shift Name"
            rules={[
              {
                message: "Please Enter the name of the Shift!",
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

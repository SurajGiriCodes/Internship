import React, { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Input, Form, Col, Row } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const Teacher = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    //FETCH THE DATA FOR TABLE
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://core.school.wtech.com.np/api/staff/teacher/",
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
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const editRecord = (record) => {
    navigate(`/teacher-profile?id=${record.id}`);
  };

  // DELETE RECORD
  const deleteRecord = async (id) => {
    const accessToken = localStorage.getItem("accessToken");
    const requestOptions = {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };
    try {
      const response = await fetch(
        `https://core.school.wtech.com.np/api/staff/teacher/${id}/`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setData((currentData) => currentData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const columns = [
    {
      title: <strong>First Name</strong>,
      dataIndex: "first_name",
      key: "first_name",
      render: (_, record) => record.first_name,
    },
    {
      title: <strong>Last Name</strong>,
      dataIndex: "last_name",
      key: "last_name",
      render: (_, record) => record.last_name,
    },
    {
      title: <strong>Subject</strong>,
      dataIndex: "subject_id",
      key: "subject_id",
      render: (_, record) => {
        const subjectNames = record.subject_name.map((subject) => subject.name);
        return subjectNames.join(", ");
      },
    },

    {
      title: <strong>Action</strong>,
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => editRecord(record)}>
            <EditOutlined />
          </a>
          <a onClick={() => deleteRecord(record.id)} style={{ color: "red" }}>
            <DeleteOutlined />
          </a>
        </Space>
      ),
    },
  ];

  const tableStyle = {
    minWidth: "1200px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    overflow: "hidden",
  };

  const rowStyle = (record, index) => {
    return {
      backgroundColor: index % 2 === 0 ? "#fafafa" : "#fff",
    };
  };

  const navigate = useNavigate();
  const addTeacherHandler = () => {
    navigate("/teacher-details");
  };

  return (
    <div>
      <h1>Teachers</h1>
      <Row gutter={[16, 16]}>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={addTeacherHandler}>
            Add Teacher
          </Button>
        </Col>
        <Col span={24}>
          <div style={{ maxWidth: "100%", overflowX: "auto" }}>
            <Table
              loading={loading}
              style={tableStyle}
              dataSource={data}
              columns={columns.map((col) => ({
                ...col,
              }))}
              rowClassName={rowStyle}
              pagination={{ pageSize: 10 }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Teacher;

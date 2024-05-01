import React, { useEffect, useRef, useState } from "react";
import { Form, Table, Space, Tooltip } from "antd";
import { useNavigate } from "react-router-dom";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const ApplicationTable = () => {
  const formRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    //FETCH THE DATA IN TABLE
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://core.school.wtech.com.np/api/school/application/",
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
        console.log("Response from API:", result);
        setData(result.map((item, index) => ({ ...item, key: index })));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const navigate = useNavigate();
  const editRecord = (record) => {
    //send id of perticular record to edit
    navigate(`/new-application?id=${record.id}`);
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
        `https://core.school.wtech.com.np/api/school/application/${id}/`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(`Record with id ${id} deleted successfully.`);

      // Update the state to remove the deleted item
      setData(data.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const columns = [
    {
      title: <strong>First Name</strong>,
      dataIndex: "first_name",
      key: "first_name",
      width: 120,
    },
    {
      title: <strong>Last Name</strong>,
      dataIndex: "last_name",
      key: "last_name",
      width: 110,
    },
    {
      title: <strong>Gender</strong>,
      dataIndex: "gender",
      key: "gender",
      render: (gender) => (gender === "M" ? "Male" : "Female"),
    },
    {
      title: <strong>Address</strong>,
      dataIndex: "address",
      key: "address",
      width: 150,
    },
    { title: <strong>Email</strong>, dataIndex: "email", key: "email" },
    {
      title: <strong>Phone Number</strong>,
      dataIndex: "phone_number",
      key: "phone_number",
      width: 150,
      render: (text) => <Tooltip title={text}>{text}</Tooltip>,
    },
    {
      title: <strong>Guardian Name</strong>,
      dataIndex: "guardian_name",
      width: 150,
      key: "guardian_name",
    },
    {
      title: <strong>Guardian Phone</strong>,
      dataIndex: "guardian_phone_number",
      key: "guardian_phone_number",
      width: 150,
    },
    {
      title: <strong>Admission Date</strong>,
      dataIndex: "enrollment_date",
      key: "enrollment_date",
      width: 150,
      render: (text) => text || "",
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

  return (
    <div style={{ overflowX: "auto" }}>
      <h1
        style={{
          textAlign: "center",
          fontSize: "24px",
          marginBottom: "20px",
          fontFamily: "Roboto",
        }}
      >
        Applicant
      </h1>
      <Form ref={formRef}></Form>
      <div style={{ maxWidth: "100%", overflowX: "auto" }}>
        <Table
          loading={loading}
          dataSource={data}
          style={tableStyle}
          columns={columns.map((col) => ({
            ...col,
          }))}
          rowClassName={rowStyle}
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default ApplicationTable;

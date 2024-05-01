import React, { useEffect, useState } from "react";
import { Button, Col, Row, Space, Table, Radio } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const StudentManagement = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("a");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    //FETCH THE DATA FOR REDIO BUTTON
    const fetchData = async () => {
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
        setClasses(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    //FETCH THE DATA IN TABLE
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://core.school.wtech.com.np/api/student/studentclass/",
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
    navigate(`/StudentDetails?id=${record.student_id.id}`);
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
        `https://core.school.wtech.com.np/api/student/student/${id}/`,
        requestOptions
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setData(data.filter((item) => item.student_id.id !== id));
    } catch (error) {
      console.error("Error deleting record:", error);
    }
  };

  const columns = [
    {
      title: <strong>First Name</strong>,
      dataIndex: "student_id",
      key: "first_name",
      render: (_, record) => record.student_id.first_name,
    },
    {
      title: <strong>Last Name</strong>,
      dataIndex: "student_id",
      key: "last_name",
      render: (_, record) => record.student_id.last_name,
    },
    {
      title: <strong>Gender</strong>,
      dataIndex: "student_id",
      key: "gender",
      render: (_, record) =>
        record.student_id.gender === "M" ? "Male" : "Female",
    },
    {
      title: <strong>Address</strong>,
      dataIndex: "student_id",
      key: "address",
      render: (_, record) => record.student_id.address,
    },
    {
      title: <strong>Email</strong>,
      dataIndex: "student_id",
      key: "email",
      render: (_, record) => record.student_id.email,
    },

    {
      title: <strong>Guardian Phone Number</strong>,
      dataIndex: "guardian_phone_number",
      key: "guardian_phone_number",
      render: (_, record) => {
        const phoneNumbers = record.student_id.guardian_id.map(
          (guardian) => guardian.guardian_phone_number
        );
        return phoneNumbers.join(", ");
      },
    },
    {
      title: <strong>Class</strong>,
      dataIndex: "class_name",
      key: "class_name",
      render: (text) => text || "",
    },
    {
      title: <strong>Admission Date</strong>,
      dataIndex: "admission_date",
      key: "admission_date",
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
          <a
            onClick={() => deleteRecord(record.student_id.id)}
            style={{ color: "red" }}
          >
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
  const addStudentHandler = () => {
    navigate("/StudentDetails");
  };

  const onClassChange = (e) => {
    setSelectedClass(e.target.value);
  };

  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          fontSize: "24px",
          marginBottom: "20px",
          fontFamily: "Roboto",
        }}
      >
        Students
      </h1>
      <Row gutter={[16, 16]}>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button type="primary" onClick={addStudentHandler}>
            Add Student
          </Button>
        </Col>
        <div style={{ marginLeft: "10px" }}>
          <Radio.Group
            defaultValue="a"
            buttonStyle="solid"
            onChange={onClassChange}
          >
            <Radio.Button value="a">All</Radio.Button>
            {classes.map((classItem, index) => {
              // Extract the numerical part from the predefined_class_name
              const classNumber =
                classItem.predefined_class_name.match(/\d+/)[0];

              return (
                <Radio.Button key={index} value={classNumber}>
                  {classNumber}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </div>
        <Col span={24}>
          <div style={{ maxWidth: "100%", overflowX: "auto" }}>
            <Table
              loading={loading}
              style={tableStyle}
              dataSource={
                selectedClass === "a"
                  ? data
                  : data.filter(
                      (item) =>
                        item.class_name.match(/\d+/)[0] === selectedClass
                    )
              }
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

export default StudentManagement;

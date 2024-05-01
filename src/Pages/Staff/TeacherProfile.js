import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Row, Col, Select } from "antd";
import { useSearchParams } from "react-router-dom";

const TeacherProfile = () => {
  const formRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [subjects, setSubjects] = useState([]);

  //FETCH TEACHER_PROFILE DATA THROUGH TEC_ID
  useEffect(() => {
    const fetchData = async () => {
      const recordId = searchParams.get("id");
      if (recordId) {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const response = await fetch(
            `https://core.school.wtech.com.np/api/staff/teacher/${recordId}`,
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
          const applicationData = await response.json();
          setIsEditMode(true);
          setApplicationId(recordId);
          formRef.current.setFieldsValue({
            first_name: applicationData.first_name,
            middle_name: applicationData.middle_name,
            last_name: applicationData.last_name,
            subjects: applicationData.subject_id,
          });
        } catch (error) {
          console.error("Error fetching application data:", error);
        }
      }
    };

    fetchData();
  }, [searchParams]);

  //CREATE TEACHER_PROFILE
  const create = async (formattedValues) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    const url = "https://core.school.wtech.com.np/api/staff/teacher/";
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formattedValues),
    };
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  };

  //FETCH DEFINED VALUE FROM API
  useEffect(() => {
    const fetchDefinedValues = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }
        var myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${accessToken}`);
        myHeaders.append("Content-Type", "application/json");

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        const response = await fetch(
          "https://core.school.wtech.com.np/api/school/predefinedsubject/",
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching predefined values:", error);
      }
    };

    fetchDefinedValues();
  }, []);

  //EDIT TEACHER_PROFILE
  const update = async (formattedValues, appId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const url = `https://core.school.wtech.com.np/api/staff/teacher/${appId}/`;
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

  const onFinish = async (values) => {
    try {
      const subjectIds = values.subjects;
      const formattedValues = {
        first_name: values.first_name,
        middle_name: values.middle_name || "",
        last_name: values.last_name,
        subject_id: subjectIds,
      };
      let result;
      if (isEditMode) {
        result = await update(formattedValues, applicationId);
      } else {
        result = await create(formattedValues);
      }
      formRef.current.resetFields();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Form
      ref={formRef}
      name="Student_profile"
      onFinish={onFinish}
      layout="vertical"
      className="custom-horizontal-form"
    >
      {subjects ? (
        <>
          <h2 style={{ fontFamily: "Roboto" }}>Teacher and class</h2>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="first_name"
                label="First Name"
                rules={[
                  { required: true, message: "Please input the first name!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item name="middle_name" label="Middle Name">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="last_name"
                label="Last Name"
                rules={[
                  { required: true, message: "Please input the last name!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={8}>
              <Form.Item name="subjects" label="Subjects">
                <Select
                  mode="multiple"
                  placeholder="Select subjects"
                  options={subjects.map((subject) => ({
                    label: subject.name,
                    value: subject.id,
                  }))}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24} style={{ textAlign: "right" }}>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ marginRight: "10px" }}
                >
                  Submit
                </Button>
              </Form.Item>
            </Col>
          </Row>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Form>
  );
};

export default TeacherProfile;

import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Row, Col, DatePicker, Radio } from "antd";
import { useSearchParams } from "react-router-dom";
import moment from "moment";

const StudentProfile = ({ onStudentAdded }) => {
  const formRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [initialFormData, setInitialFormData] = useState({
    genderChoices: null,
  });

  //FETCH STUDENT_PROFILE DATA THROUGH STU_ID
  useEffect(() => {
    const fetchData = async () => {
      const recordId = searchParams.get("id");
      if (recordId) {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const response = await fetch(
            `https://core.school.wtech.com.np/api/student/studentclass/?student_id=${recordId}`,
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
          const studentInfo = applicationData[0].student_id;
          formRef.current.setFieldsValue({
            ...studentInfo,
            date_of_birth: moment(studentInfo.date_of_birth, "YYYY-MM-DD"),
          });
        } catch (error) {
          console.error("Error fetching application data:", error);
        }
      }
    };

    fetchData();
  }, [searchParams]);

  //CREATE STU_PROFILE
  const create = async (formattedValues) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    const url = "https://core.school.wtech.com.np/api/student/student/";
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

  // FETCH DEFINED VALUE FROM API
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
          "https://core.school.wtech.com.np//api/school/application_data/",
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setInitialFormData({
          genderChoices: data.gender_choices,
        });
      } catch (error) {
        console.error("Error fetching predefined values:", error);
      }
    };

    fetchDefinedValues();
  }, []);

  //EDIT STUD_PROFILE
  const update = async (formattedValues, appId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const url = `https://core.school.wtech.com.np/api/student/student/${appId}/`;
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
      const formattedValues = {
        first_name: values.first_name,
        middle_name: values.middle_name || "",
        last_name: values.last_name,
        date_of_birth: values.date_of_birth
          ? values.date_of_birth.format("YYYY-MM-DD")
          : null,
        gender: values.gender,
        religion: values.religion,
        address: values.address,
        email: values.email,
        phone_number: parseInt(values.phone_number, 10),
        guardian_id: [],
      };

      let result;
      if (isEditMode) {
        result = await update(formattedValues, applicationId);
      } else {
        result = await create(formattedValues);
        if (result && result.id) {
          onStudentAdded(result.id);
        }
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
      {initialFormData.genderChoices ? (
        <>
          <h2 style={{ fontFamily: "Roboto" }}>Student Details</h2>
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
              <Form.Item
                name="date_of_birth"
                label="Date of Birth"
                rules={[
                  { required: true, message: "Please select date of birth!" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  value={
                    formRef.current?.getFieldValue("date_of_birth") || null
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="gender"
                label="Gender"
                rules={[{ required: true, message: "Please select gender!" }]}
              >
                <Radio.Group>
                  {initialFormData.genderChoices.map(([value, label]) => (
                    <Radio key={value} value={value}>
                      {label}
                    </Radio>
                  ))}
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="religion"
                label="Religion"
                rules={[{ required: true, message: "Please input religion!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="address"
                label="Address"
                rules={[{ required: true, message: "Please input address!" }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { required: true, message: "Please input email!" },
                  { type: "email", message: "The input is not valid E-mail!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="phone_number"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please input phone number!" },
                  {
                    pattern: new RegExp(/^\d{10}$/),
                    message: "Phone number must be exactly 10 digits!",
                  },
                ]}
              >
                <Input type="tel" />
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

export default StudentProfile;

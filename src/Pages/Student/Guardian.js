import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Row, Col, DatePicker, Select, Radio } from "antd";
import { useSearchParams } from "react-router-dom";

const Guardian = ({ studentId }) => {
  const formRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [initialFormData, setInitialFormData] = useState({
    guardianTypeChoices: null,
  });

  //FETCH GUARDAIN DATA THROUGH STU_ID
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
          const guardians = studentInfo.guardian_id || [];
          const guardian1 = guardians[0] || {};
          const guardian2 = guardians[1] || {};

          formRef.current.setFieldsValue({
            ...studentInfo,
            // Guardian 1
            guardian_type1: guardian1.guardian_type,
            guardian_name1: guardian1.guardian_name,
            guardian_phone_number1: guardian1.guardian_phone_number,
            // Guardian 2
            guardian_type2: guardian2.guardian_type,
            guardian_name2: guardian2.guardian_name,
            guardian_phone_number2: guardian2.guardian_phone_number,
          });
        } catch (error) {
          console.error("Error fetching application data:", error);
        }
      }
    };

    fetchData();
  }, [searchParams]);

  // FETCH DEFINE VALUE FROM API
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
          guardianTypeChoices: data.guardian_type_choices,
        });
      } catch (error) {
        console.error("Error fetching predefined values:", error);
      }
    };

    fetchDefinedValues();
  }, []);

  //CREATE GUARDAIN
  const create = async (formattedGuardians) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    const url = `https://core.school.wtech.com.np/api/student/student/${studentId}/add_guardian/`;
    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formattedGuardians),
    };

    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  };

  //EDIT GUARDAIN
  const update = async (formattedGuardians, appId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    const url = `https://core.school.wtech.com.np/api/student/student/${appId}/update_guardians/`;
    const requestOptions = {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formattedGuardians),
    };
    const response = await fetch(url, requestOptions);
    return response.json();
  };

  const onFinish = async (values) => {
    try {
      const guardians = [
        {
          guardian_type: values.guardian_type1,
          guardian_name: values.guardian_name1,
          guardian_phone_number: values.guardian_phone_number1,
        },
        {
          guardian_type: values.guardian_type2,
          guardian_name: values.guardian_name2,
          guardian_phone_number: values.guardian_phone_number2,
        },
      ];

      const formattedGuardians = guardians.filter(
        (guardian) =>
          guardian.guardian_type &&
          guardian.guardian_name &&
          guardian.guardian_phone_number
      );
      let result;
      if (isEditMode) {
        result = await update(formattedGuardians, applicationId);
      } else {
        result = await create(formattedGuardians);
      }
      formRef.current.resetFields();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Form
      ref={formRef}
      name="Student_Guardian"
      onFinish={onFinish}
      layout="vertical"
      className="custom-horizontal-form"
    >
      {initialFormData.guardianTypeChoices ? (
        <>
          <h2 style={{ fontFamily: "Roboto" }}>Guardian Details</h2>
          <Row gutter={16}>
            {/* Guardian 1 */}
            <Col xs={24} sm={24} md={8}>
              <Form.Item name="guardian_type1" label="Guardian Relationship">
                <Select placeholder="Select a relationship">
                  {initialFormData.guardianTypeChoices.map(([value, label]) => (
                    <Select.Option key={value} value={value}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="guardian_name1"
                label="Guardian Name"
                rules={[
                  { required: true, message: "Please input guardian's name!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="guardian_phone_number1"
                label="Guardian Phone Number"
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
            {/* Guardian 2 */}
            <Col xs={24} sm={24} md={8}>
              <Form.Item name="guardian_type2" label="Guardian Relationship">
                <Select placeholder="Select a relationship">
                  {initialFormData.guardianTypeChoices.map(([value, label]) => (
                    <Select.Option key={value} value={value}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="guardian_name2"
                label="Guardian Name"
                rules={[
                  { required: true, message: "Please input guardian's name!" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="guardian_phone_number2"
                label="Guardian Phone Number"
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

export default Guardian;

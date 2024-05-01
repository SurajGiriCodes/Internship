import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Button, Row, Col, DatePicker, Select, Radio } from "antd";
import { useSearchParams } from "react-router-dom";
import moment from "moment";

const NewApplication = () => {
  const formRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [initialFormData, setInitialFormData] = useState({
    genderChoices: null,
    guardianTypeChoices: null,
    classOptions: null,
  });

  useEffect(() => {
    //FETCH APPLICATION DATA THROUGH ID
    const fetchApplicationData = async () => {
      const recordId = searchParams.get("id");
      if (recordId) {
        try {
          const accessToken = localStorage.getItem("accessToken");
          const response = await fetch(
            `https://core.school.wtech.com.np/api/school/application/${recordId}/`,
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
          // Populate the form with the fetched data
          formRef.current.setFieldsValue({
            ...applicationData,
            date_of_birth: moment(applicationData.date_of_birth, "YYYY-MM-DD"),
            enrollment_date: moment(
              applicationData.enrollment_date,
              "YYYY-MM-DD"
            ),
          });
        } catch (error) {
          console.error("Error fetching application data:", error);
        }
      }
    };

    fetchApplicationData();
  }, [searchParams]);

  // FETCH PREDEFINE VALUE FROM API
  useEffect(() => {
    const fetchPredefinedValues = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("No access token found");
        }

        // Prepare the headers
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
          guardianTypeChoices: data.guardian_type_choices,
          classOptions: data.predefined_class_data,
        });
      } catch (error) {
        console.error("Error fetching predefined values:", error);
      }
    };

    fetchPredefinedValues();
  }, []);

  //CREATE APPLICATION
  const createApplication = async (formattedValues) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const url = "https://core.school.wtech.com.np/api/school/application/";
    // Add other headers and configurations as required
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
    return response.json();
  };

  //EDIT APPLICATION
  const updateApplication = async (formattedValues, appId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const url = `https://core.school.wtech.com.np/api/school/application/${appId}/`;
    // Add other headers and configurations as required
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
        guardian_type: values.guardian_type,
        guardian_name: values.guardian_name,
        guardian_phone_number: parseInt(values.guardian_phone_number, 10),
        predefined_class_id: values.predefined_class_id,
        enrollment_date: values.enrollment_date
          ? values.enrollment_date.format("YYYY-MM-DD")
          : null,
      };

      let result;
      if (isEditMode) {
        result = await updateApplication(formattedValues, applicationId);
      } else {
        result = await createApplication(formattedValues);
      }

      console.log("Success:", result);

      formRef.current.resetFields();
    } catch (error) {
      console.error("Error:", error);
    }
  };
  const [formLayout, setFormLayout] = useState("horizontal");

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1510) {
        setFormLayout("vertical");
      } else {
        setFormLayout("horizontal");
      }
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Form
      ref={formRef}
      name="new_application"
      onFinish={onFinish}
      layout={formLayout}
      className="custom-horizontal-form"
    >
      {initialFormData.genderChoices &&
      initialFormData.guardianTypeChoices &&
      initialFormData.classOptions ? (
        <>
          <h1
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontFamily: "Roboto",
            }}
          >
            {isEditMode ? "Edit Application" : "New Application"}
          </h1>

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
                ]}
              >
                <Input type="tel" />
              </Form.Item>
            </Col>
          </Row>

          <h2 style={{ fontFamily: "Roboto" }}>Guardian Details</h2>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={8}>
              <Form.Item name="guardian_type" label="Guardian Relationship">
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
                name="guardian_name"
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
                name="guardian_phone_number"
                label="Guardian Phone Number"
                rules={[
                  {
                    required: true,
                    message: "Please input guardian's phone number!",
                  },
                ]}
              >
                <Input type="tel" />
              </Form.Item>
            </Col>
          </Row>

          <h2 style={{ fontFamily: "Roboto" }}>Admission Details</h2>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={8}>
              <Form.Item
                name="enrollment_date"
                label="Application Date"
                rules={[
                  {
                    required: true,
                    message: "Please select the application date!",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  value={
                    formRef.current?.getFieldValue("enrollment_date") || null
                  }
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={8}>
              <Form.Item name="predefined_class_id" label="Class">
                <Select placeholder="Select a class">
                  {initialFormData.classOptions?.map((classOption) => (
                    <Select.Option key={classOption.id} value={classOption.id}>
                      {classOption.name}
                    </Select.Option>
                  ))}
                </Select>
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
                <Button type="default" htmlType="button">
                  Cancel
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

export default NewApplication;

import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Row, Col, Select } from "antd";
import { useSearchParams } from "react-router-dom";

const Admission = (studentId) => {
  const formRef = useRef(null);
  const [searchParams] = useSearchParams();
  const [isEditMode, setIsEditMode] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [classroomOptions, setClassroomOptions] = useState([]);
  const [admissionDate, setAdmissionDate] = useState(null);

  //FETCH GUARDAIN DATA THROUGH ADMISS_ID
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
          const studentInfo = applicationData[0].student_id;
          setAdmissionDate(applicationData[0].admission_date);
          const AdmissionId = applicationData[0].id;
          setApplicationId(AdmissionId);
          formRef.current.setFieldsValue({
            ...studentInfo,
            ay_classroom_id: applicationData[0].ay_classroom_id,
          });
        } catch (error) {
          console.error("Error fetching application data:", error);
        }
      }
    };

    fetchData();
  }, [searchParams]);

  //FETCH DEFINE VALUE FROM API
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
          "https://core.school.wtech.com.np/api/school/classroom/",
          requestOptions
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const transformedData = data.map((item) => {
          return {
            id: item.id,
            ay_class_id: item.ay_class_id,
            displayName: `${item.shift_name}-${item.predefined_class_name}-${item.name}`,
          };
        });
        setClassroomOptions(transformedData);
      } catch (error) {
        console.error("Error fetching predefined values:", error);
      }
    };

    fetchDefinedValues();
  }, []);

  //CREATE Admission
  const create = async (formattedValues) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }

    const url =
      "https://core.school.wtech.com.np/api/student/studentadmission/";

    const requestOptions = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formattedValues),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error("Error creating application:", error);
      throw error;
    }
  };

  //EDIT Admission
  const update = async (formattedValues, appId) => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      throw new Error("No access token found");
    }
    const url = `https://core.school.wtech.com.np/api/student/studentadmission/${appId}/`;
    const requestOptions = {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(formattedValues),
    };

    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      const responseData = await response.json();
      console.log(responseData);
      return responseData;
    } catch (error) {
      console.error("Error updating application:", error);
      throw error;
    }
  };

  const onFinish = async (values) => {
    try {
      const selectedClassroom = classroomOptions.find(
        (option) => option.id === values.ay_classroom_id
      );

      const formattedValues = {
        ay_class_id: selectedClassroom ? selectedClassroom.ay_class_id : null,
        ay_classroom_id: values.ay_classroom_id,
        admission_date: getCurrentDate(),
        student_id: studentId.studentId,
      };
      const formattedValuesEdit = {
        ay_class_id: selectedClassroom ? selectedClassroom.ay_class_id : null,
        ay_classroom_id: values.ay_classroom_id,
      };
      let result;
      if (isEditMode) {
        result = await update(formattedValuesEdit, applicationId);
      } else {
        result = await create(formattedValues);
      }
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

  // Function to get current date in formatted string
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <Form
      ref={formRef}
      name="admission"
      onFinish={onFinish}
      layout={formLayout}
      className="custom-horizontal-form"
    >
      {classroomOptions ? (
        <>
          <h2 style={{ fontFamily: "Roboto" }}>Admission Details</h2>
          <p style={{ fontFamily: "Roboto", fontSize: "16px" }}>
            <b>Academic Year: </b>
            {isEditMode ? admissionDate : getCurrentDate()}
          </p>
          <Row gutter={16}>
            <Col xs={24} sm={24} md={8}>
              <Form.Item name="ay_classroom_id" label="Class">
                <Select placeholder="Select a class">
                  {classroomOptions.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.displayName}
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

export default Admission;

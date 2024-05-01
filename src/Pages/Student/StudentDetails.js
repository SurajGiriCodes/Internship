import React, { useState } from "react";
import { Tabs } from "antd";
import StudentProfile from "./StudentProfile";
import Guardian from "./Guardian";
import Admission from "./Admission";

const StudentDetails = () => {
  const [activeTabKey, setActiveTabKey] = useState("profile");
  const [studentId, setStudentId] = useState(null);

  const handleSetStudentId = (id) => {
    setStudentId(id);
  };

  const tabItems = [
    {
      label: "Profile",
      key: "profile",
      children: <StudentProfile onStudentAdded={handleSetStudentId} />,
    },
    {
      label: "Guardian",
      key: "guardian",
      children: <Guardian studentId={studentId} />,
    },
    {
      label: "Admission",
      key: "admission",
      children: <Admission studentId={studentId} />,
    },
  ];

  return (
    <Tabs
      tabPosition="left"
      activeKey={activeTabKey}
      onTabClick={(key) => setActiveTabKey(key)}
      items={tabItems}
    />
  );
};

export default StudentDetails;

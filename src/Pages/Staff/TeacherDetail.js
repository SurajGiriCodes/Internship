import React, { useState } from "react";
import { Tabs } from "antd";
import TeacherProfile from "./TeacherProfile";

const TeacherDetail = () => {
  const [activeTabKey, setActiveTabKey] = useState("profile");

  const tabItems = [
    {
      label: "Profile",
      key: "profile",
      children: <TeacherProfile />,
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

export default TeacherDetail;

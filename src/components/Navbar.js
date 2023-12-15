import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { useTheme } from "../ThemeProvider";
import { Switch, ConfigProvider, Table } from "antd";
import "./navbar.css";
import { useNavigate } from "react-router-dom";

import { Menu } from "antd";
import { PieChartOutlined, AppstoreOutlined } from "@ant-design/icons";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return <AppMenu toggleTheme={toggleTheme} theme={theme} />;
};

function AppMenu({ toggleTheme, theme }) {
  const [selectedMenuItem, setSelectedMenuItem] = useState("table");
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflowY: "hidden",
      }}
    >
      <div
        style={{
          position: "fixed",
          height: "100%",
          transition: "width 0.3s",
          overflowY: "auto",
          width: 256,
        }}
      >
        <Menu
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          selectedKeys={[selectedMenuItem]}
          mode="inline"
          theme={theme}
          style={{ height: "100%", borderRight: 0 }}
        >
          <Menu.Item
            key="main"
            disabled
            style={{
              fontSize: "18px",
              fontWeight: "bold",
            }}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item key="table" icon={<PieChartOutlined />}>
            Table
          </Menu.Item>

          <Menu.Item key="login" label="login" icon={<PieChartOutlined />}>
            Login
          </Menu.Item>

          <Menu.Item key="logout" icon={<AppstoreOutlined />}>
            Logout
          </Menu.Item>
        </Menu>
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "0",
            right: "0",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Switch
            checkedChildren="Dark"
            unCheckedChildren="Light"
            onClick={toggleTheme}
          />
        </div>
      </div>
      <div
        style={{ marginLeft: 256, padding: "20px", flex: 1, overflowY: "auto" }}
      >
        <Outlet />
      </div>
    </div>
  );
}

export default Navbar;

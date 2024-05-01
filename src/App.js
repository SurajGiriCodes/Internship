import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import { Button, Layout, Menu, Drawer } from "antd";
import {
  PieChartOutlined,
  MenuOutlined,
  CloseOutlined,
  AppstoreOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import NewApplication from "./Pages/NewApplication/NewApplicant";
import ApplicationTable from "./Pages/NewApplication/ApplicationTable";
import Dashboard from "./Pages/Dasboard";
import Login from "./Pages/LoginPage/Login";
import "./App.css";
import { useNavigate } from "react-router-dom";
import ClassRoomManagement from "./Pages/ClassRoom/ClassRoomManagement";
import StudentManagement from "./Pages/Student/StudentManagement";
import StudentDetails from "./Pages/Student/StudentDetails";
import Teacher from "./Pages/Staff/Teacher";
import TeacherDetail from "./Pages/Staff/TeacherDetail";
import TeacherProfile from "./Pages/Staff/TeacherProfile";
import { ClassRoomProvider } from "./Context/ClassRoomContext";
import Attendance from "./Pages/Attendance/Attendance";
import Routine from "./Pages/Routine/Routine";

const isAuthenticated = () => {
  const token = localStorage.getItem("accessToken");
  return token != null;
};

const { Header, Sider, Content } = Layout;

const AppLayout = ({ children }) => {
  const [sidebarVisible, setSidebarVisible] = useState(
    window.innerWidth > 1050
  );
  const [drawerVisible, setDrawerVisible] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const shouldShowSidebar = window.innerWidth > 1050;
      setSidebarVisible(shouldShowSidebar);
      if (!shouldShowSidebar) {
        setDrawerVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleMenu = () => {
    if (window.innerWidth <= 1050) {
      setDrawerVisible(!drawerVisible);
    } else {
      setSidebarVisible(!sidebarVisible);
    }
  };

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    navigate("/login");
  };

  //This function is responsible for decoding a JWT.
  const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
      return null;
    }
  };
  //This function checks whether the stored JWT is valid based on its expiration time.
  const isTokenValid = () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;
    const decodedToken = parseJwt(token);
    const currentTime = new Date().getTime() / 1000;
    return decodedToken && decodedToken.exp > currentTime;
  };

  useEffect(() => {
    if (!isTokenValid()) {
      navigate("/login");
    }
  }, [isTokenValid, navigate]);

  const menuItems = [
    {
      key: "dashboard",
      icon: <PieChartOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "NewApplicant",
      icon: <PieChartOutlined />,
      label: "New Application",
      children: [
        {
          key: "createNewApplication",
          label: <Link to="/new-application">Create New Application</Link>,
        },
        {
          key: "viewApplications",
          label: <Link to="/view-applications">View Applications</Link>,
        },
      ],
    },
    {
      key: "Student",
      icon: <PieChartOutlined />,
      label: <Link to="/student-management">Student Management</Link>,
    },
    {
      key: "teacher",
      icon: <PieChartOutlined />,
      label: <Link to="/teacher">Staffs</Link>,
    },
    {
      key: "attendance",
      icon: <ClockCircleOutlined />,
      label: <Link to="/attendance">Attendance</Link>,
    },
    {
      key: "routine",
      icon: <ClockCircleOutlined />,
      label: <Link to="/routine">Routine</Link>,
    },
    {
      key: "configuration",
      icon: <PieChartOutlined />,
      label: "Configuration",
      children: [
        {
          key: "subMenuInside",
          label: "Academy Year",
          icon: <AppstoreOutlined />,
          children: [
            {
              key: "SchoolProfile",
              label: "School Profile",
            },
            {
              key: "ClassStructure",
              label: (
                <Link to="/classRoom-management">ClassRoom Management</Link>
              ),
            },
          ],
        },
      ],
    },
  ];

  const MenuTitle = () => (
    <div
      style={{
        fontSize: "16px",
        color: "#FFFFFF",
        marginTop: "20px",
        marginBottom: "20px",
        fontFamily: "'SF Pro Text', sans-serif",
        userSelect: "none",
        backgroundColor: "transparent",
        display: "flex",
        alignItems: "center",
        paddingLeft: "12px",
      }}
    >
      <span
        style={{
          width: "16px",
          height: "16px",
          backgroundColor: "#0000ff",
          borderRadius: "50%",
          marginRight: "15px",
        }}
      />
      School Management
    </div>
  );

  const menuItemsSider = [
    {
      key: "title",
      label: <MenuTitle />,
      style: { pointerEvents: "none" },
    },
    {
      key: "dashboard",
      icon: <PieChartOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "NewApplicant",
      icon: <PieChartOutlined />,
      label: "New Application",
      children: [
        {
          key: "createNewApplication",
          label: <Link to="/new-application">Create New Application</Link>,
        },
        {
          key: "viewApplications",
          label: <Link to="/view-applications">View Applications</Link>,
        },
      ],
    },
    {
      key: "Student",
      icon: <PieChartOutlined />,
      label: <Link to="/student-management">Student Management</Link>,
    },
    {
      key: "teacher",
      icon: <PieChartOutlined />,
      label: <Link to="/teacher">Staffs</Link>,
    },
    {
      key: "attendance",
      icon: <ClockCircleOutlined />,
      label: <Link to="/attendance">Attendance</Link>,
    },
    {
      key: "routine",
      icon: <ClockCircleOutlined />,
      label: <Link to="/routine">Routine</Link>,
    },
    {
      key: "configuration",
      icon: <PieChartOutlined />,
      label: "Configuration",
      children: [
        {
          key: "subMenuInside",
          label: "Academy Year",
          icon: <AppstoreOutlined />,
          children: [
            {
              key: "SchoolProfile",
              label: "School Profile",
            },
            {
              key: "ClassStructure",
              label: (
                <Link to="/classRoom-management">ClassRoom Management</Link>
              ),
            },
          ],
        },
      ],
    },
  ];

  const headerMenuItems = [
    {
      key: "menu",
      icon: (
        <MenuOutlined
          onClick={toggleMenu}
          className="hamburger-menu"
          style={{ fontSize: "20px" }}
        />
      ),
    },
    {
      key: "logout",
      label: (
        <Button type="primary" onClick={logout}>
          Logout
        </Button>
      ),
      style: { marginLeft: "auto" },
    },
  ];

  return (
    <Layout style={{ height: "100vh" }}>
      {window.innerWidth <= 1050 ? (
        <Drawer
          title={
            <div className="drawer-title">
              <span className="drawer-title-icon" />
              School Management
            </div>
          }
          placement="left"
          onClose={() => setDrawerVisible(false)}
          open={drawerVisible}
          width={256}
          style={{ backgroundColor: "#001529", color: "#ffffff" }}
          closeIcon={
            <div className="drawer-close-icon">
              <CloseOutlined style={{ color: "#ffffff" }} />
            </div>
          }
        >
          <Menu mode="inline" theme="dark" items={menuItems} />
        </Drawer>
      ) : (
        <Sider
          width={256}
          collapsed={!sidebarVisible}
          onCollapse={toggleSidebar}
          collapsedWidth="0"
          style={{ overflowY: "auto", height: "100vh", position: "fixed" }}
        >
          {sidebarVisible && (
            <div
              style={{
                position: "absolute",
                top: 10,
                right: 10,
                zIndex: 2,
              }}
            >
              <CloseOutlined
                onClick={toggleSidebar}
                className="close-icon"
                style={{
                  cursor: "pointer",
                  color: "#fff",
                  fontSize: "16px",
                }}
              />
            </div>
          )}
          <Menu mode="inline" theme="dark" items={menuItemsSider} />
        </Sider>
      )}
      <Layout
        style={{
          marginLeft: sidebarVisible && window.innerWidth > 800 ? 256 : 0,
        }}
      >
        <Header
          style={{
            padding: 0,
            position: "fixed",
            zIndex: 1,
            width: sidebarVisible ? "calc(100% - 256px)" : "100%",
            backgroundColor: "#fff",
          }}
          className="app-header"
        >
          <Menu
            mode="horizontal"
            items={headerMenuItems}
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          />
        </Header>

        <Content
          style={{
            marginTop: 64,
            overflowY: "auto",
            backgroundColor: "white",
            padding: "20px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

function App() {
  return (
    <Router>
      <ClassRoomProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              isAuthenticated() ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/dashboard"
            element={
              <AppLayout>
                <Dashboard />
              </AppLayout>
            }
          />
          <Route
            path="/new-application"
            element={
              <AppLayout>
                <NewApplication />
              </AppLayout>
            }
          />
          <Route
            path="/view-applications"
            element={
              <AppLayout>
                <ApplicationTable />
              </AppLayout>
            }
          />
          <Route
            path="/classRoom-management"
            element={
              <AppLayout>
                <ClassRoomManagement />
              </AppLayout>
            }
          />
          <Route
            path="/student-management"
            element={
              <AppLayout>
                <StudentManagement />
              </AppLayout>
            }
          />
          <Route
            path="/StudentDetails"
            element={
              <AppLayout>
                <StudentDetails />
              </AppLayout>
            }
          />
          <Route
            path="/teacher"
            element={
              <AppLayout>
                <Teacher />
              </AppLayout>
            }
          />
          <Route
            path="/teacher-details"
            element={
              <AppLayout>
                <TeacherDetail />
              </AppLayout>
            }
          />
          <Route
            path="/teacher-profile"
            element={
              <AppLayout>
                <TeacherProfile />
              </AppLayout>
            }
          />
          <Route
            path="/attendance"
            element={
              <AppLayout>
                <Attendance />
              </AppLayout>
            }
          />
          <Route
            path="/routine"
            element={
              <AppLayout>
                <Routine />
              </AppLayout>
            }
          />
        </Routes>
      </ClassRoomProvider>
    </Router>
  );
}

export default App;

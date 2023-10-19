import React, { useContext, useEffect, useState } from "react";
import { Space, Table, Modal, Button } from "antd";
import classes from "./table.module.css";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { API_URL } from "../ApiConfig";

const { Column, ColumnGroup } = Table; //destructuring the Column component from the Table component.

const StuTable = () => {
  const navigate = useNavigate();
  const { setEditData } = useUser();
  const [createdData, setCreatedData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL);
      const responseData = await response.json();
      setCreatedData(responseData);
    } catch (error) {
      console.error("Error fetching created data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      fetchData();
    } catch (error) {
      console.error("Error deleting data: ", error);
    }
  };

  const showDeleteModal = (record) => {
    Modal.confirm({
      title: "Delete Confirmation",
      content: "Are you sure you want to delete this item?",
      onOk: () => handleDelete(record._id),
    });
  };

  return (
    <div className={classes.Maintable}>
      <Link to="/create">
        <Button type="primary" className={classes.createbtn}>
          Create
        </Button>
      </Link>

      <Table
        dataSource={createdData.map((item, index) => ({ ...item, key: index }))}
      >
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" />
        <Column title="Age" dataIndex="age" key="age" />
        <Column title="Address" dataIndex="address" key="address" />

        <ColumnGroup
          title="Action"
          key="action"
          render={(_, record) => (
            <Space size="middle">
              <Button
                type="primary"
                style={{ background: "#7cb305", borderColor: "#7cb305" }}
                onClick={() => {
                  setEditData(record);
                  navigate("./create");
                }}
              >
                Edit
              </Button>
              <Button
                type="primary"
                danger
                onClick={() => showDeleteModal(record)} // Pass the item's key (ID) to the delete function
              >
                Delete
              </Button>
            </Space>
          )}
        />
      </Table>
    </div>
  );
};

export default StuTable;

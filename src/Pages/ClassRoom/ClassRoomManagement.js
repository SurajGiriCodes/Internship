import React, { useState, useEffect } from "react";
import ShiftComponent from "./ShiftComponent";
import ClassComponent from "./ClassComponent";
import ClassRoomComponent from "./ClassRoomComponent";

const ClassRoomManagement = () => {
  const [shifts, setShifts] = useState([]);
  const [classes, setClasses] = useState([]);

  const fetchShifts = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        "https://core.school.wtech.com.np/api/school/schoolshift/",
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

      const fetchedShiftData = await response.json();
      setShifts(fetchedShiftData);
    } catch (error) {
      console.error("Error fetching shifts:", error);
    }
  };

  const fetchClasses = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        "https://core.school.wtech.com.np/api/school/schoolclass/",
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

      const fetchedClassData = await response.json();
      setClasses(fetchedClassData);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  useEffect(() => {
    fetchShifts();
    fetchClasses();
  }, []);

  return (
    <div>
      <h1>Shift</h1>
      <ShiftComponent onShiftsChange={fetchShifts} />
      <h1>Class</h1>
      <ClassComponent onClassesChange={fetchClasses} />
      <h1>Class Room</h1>
      <ClassRoomComponent shifts={shifts} classes={classes} />
    </div>
  );
};

export default ClassRoomManagement;

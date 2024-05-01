import React, { useContext, useEffect, useState } from "react";
import { ClassRoomContext } from "../../Context/ClassRoomContext";
import { Form, Select, Row, Col, Table, Checkbox, Button } from "antd";
import NepaliDate from "nepali-date-converter";

const { Option } = Select;
const nepaliMonths = [
  { id: 1, name: "Baishakh" },
  { id: 2, name: "Jestha" },
  { id: 3, name: "Ashadh" },
  { id: 4, name: "Shrawan" },
  { id: 5, name: "Bhadra" },
  { id: 6, name: "Ashwin" },
  { id: 7, name: "Kartik" },
  { id: 8, name: "Mangsir" },
  { id: 9, name: "Poush" },
  { id: 10, name: "Magh" },
  { id: 11, name: "Falgun" },
  { id: 12, name: "Chaitra" },
];

const defaultNepaliYear = () => {
  const today = new NepaliDate();
  return today.getYear().toString();
};

const getCurrentNepaliMonthId = () => {
  const today = new NepaliDate();
  const nepaliMonthNumber = today.getMonth(); // Note: Ensure this gets the correct month number as per your date library's documentation
  const currentNepaliMonth = nepaliMonths.find(
    (month) => month.id === nepaliMonthNumber
  );
  return currentNepaliMonth ? currentNepaliMonth.id : undefined;
};

const defaultNepaliMonthId = getCurrentNepaliMonthId();

const nepaliYears = [];
for (let year = 2080; year <= 3000; year++) {
  nepaliYears.push(year);
}

export default function Attendance() {
  const { ClassRoomData } = useContext(ClassRoomContext);
  const [selectedYear, setSelectedYear] = useState(defaultNepaliYear());
  const [selectedMonth, setSelectedMonth] = useState(defaultNepaliMonthId);
  const [students, setStudents] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [daysInMonth, setDaysInMonth] = useState(0);
  const [attendanceChanges, setAttendanceChanges] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  //default classRoom selection
  useEffect(() => {
    if (ClassRoomData && ClassRoomData.length > 0) {
      setSelectedClassId(ClassRoomData[0].id);
    }
  }, [ClassRoomData]);

  const handleClassChange = (value) => {
    setSelectedClassId(value);
  };

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    const fetchData = async () => {
      if (selectedClassId && selectedYear && selectedMonth) {
        setIsLoading(true);
        const url = `https://core.school.wtech.com.np/api/classroom/classroomattendance/?classroom_id=${selectedClassId}&year_BS=${selectedYear}&month_BS=${selectedMonth}`;
        try {
          const response = await fetch(url, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (!response.ok) {
            throw new Error("Network response was not OK");
          }
          const data = await response.json();

          setDaysInMonth(data.days_in_month);

          // Initialize student data with attendance
          const formattedStudents = data.classroom_students.map((student) => ({
            key: student.student_id.toString(),
            name: `${student.first_name} ${student.last_name}`.trim(),
            roll_no: student.roll_no,
            // Initialize an array of undefined values for each day of the month
            days: Array.from({ length: data.days_in_month }, () => undefined),
            attendance_ids: student.attendance_data.reduce((acc, curr) => {
              acc[curr.present_day] = curr.id; // Map each day to its attendance ID
              return acc;
            }, {}),
          }));

          //Populate attendance data
          data.classroom_students.forEach((student) => {
            const studentIndex = formattedStudents.findIndex(
              (s) => s.key === student.student_id.toString()
            );
            student.attendance_data.forEach((attendance) => {
              if (studentIndex !== -1) {
                // Mark attendance as true or false for the specific day, subtract 1 since arrays are 0-indexed
                formattedStudents[studentIndex].days[
                  attendance.present_day - 1
                ] = attendance.attendance;
              }
            });
          });

          setStudents(formattedStudents);
          setIsLoading(false);
        } catch (error) {
          console.error("Fetch error:", error);
          setIsLoading(false);
        }
      }
    };

    fetchData();
  }, [selectedClassId, selectedYear, selectedMonth, accessToken]);

  const handleAttendanceChange = (studentKey, day, isChecked) => {
    const student = students.find((student) => student.key === studentKey);
    // Attempt to retrieve an existing attendance ID. If none exists, default to null.
    const attendanceId = student?.attendance_ids[day] || null;

    setAttendanceChanges((prevChanges) => {
      //Accessing the Previous State (prevChanges): React automatically provides the current (previous) state as the argument to this function (prevChanges in your case). This is the state right before the update is applied.
      const studentChanges = prevChanges[studentKey] || [];
      //existing change record for the specific day
      const changeIndex = studentChanges.findIndex(
        (change) => change.day === day.toString()
      );

      // Checks if an existing change for the specific day was found.
      if (changeIndex !== -1) {
        // Update existing change
        studentChanges[changeIndex].status_change_to = isChecked;
      } else {
        // Add new change
        studentChanges.push({
          attendance_id: attendanceId, // Set to actual ID if available
          day: day.toString(),
          status: !isChecked, // Assuming this is the original status (flip isChecked for example)
          status_change_to: isChecked,
        });
      }

      return { ...prevChanges, [studentKey]: studentChanges };
    });

    // Additionally, update the students state to reflect the change immediately
    setStudents((prevStudents) => {
      return prevStudents.map((student) => {
        if (student.key === studentKey) {
          const updatedDays = [...student.days];
          updatedDays[day - 1] = isChecked; // Update the specific day's attendance
          return { ...student, days: updatedDays };
        }
        return student;
      });
    });
  };

  const columns = [
    {
      title: "Roll No",
      dataIndex: "roll_no",
      key: "roll_no",
    },
    {
      title: "Students/Days",
      dataIndex: "name",
      key: "name",
    },
    // Generate columns for days dynamically based on daysInMonth
    ...Array.from({ length: daysInMonth }, (_, index) => ({
      title: index + 1,
      key: `day-${index + 1}`,
      render: (_, record, rowIndex) => (
        <Checkbox
          checked={record.days[index] === true}
          onChange={(e) =>
            handleAttendanceChange(record.key, index + 1, e.target.checked)
          }
        />
      ),
    })),
  ];

  //specific format suitable for sending to a backend
  const prepareAndSaveAttendanceChanges = async () => {
    const changesPayload = {
      classroom_id: selectedClassId, //Use the selectedClassId from state
      year: selectedYear, //Use the selectedYear from state
      month: selectedMonth, //Use the selectedMonth from state
      changes: Object.entries(attendanceChanges).map(
        ([studentId, changes]) => ({
          student_id: studentId,
          attendance: changes.map(
            ({ attendance_id, day, status, status_change_to }) => ({
              attendance_id,
              day,
              status,
              status_change_to,
            })
          ),
        })
      ),
    };

    const apiUrl =
      "https://core.school.wtech.com.np/api/classroom/classroomattendance/";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(changesPayload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
    } catch (error) {
      console.error("Error submitting attendance data:", error.message);
    }
  };

  return (
    <div>
      <Row justify="end">
        <Form layout="inline">
          <Form.Item label="Class">
            <Select
              placeholder="Select a class"
              style={{ width: 200 }}
              onChange={handleClassChange}
              value={selectedClassId}
            >
              {Array.isArray(ClassRoomData) &&
                ClassRoomData.map((classItem) => (
                  <Option key={classItem.id} value={classItem.id}>
                    {`${classItem.predefined_class_name} (${classItem.name}) - ${classItem.shift_name}`}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item label="Year">
            <Select
              onChange={setSelectedYear}
              placeholder="Select a year"
              style={{ width: 200 }}
              value={selectedYear}
            >
              {nepaliYears.map((year) => (
                <Option key={year} value={year}>
                  {year}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Month">
            <Select
              onChange={(value) => setSelectedMonth(value)}
              placeholder="Select a month"
              style={{ width: 200 }}
              value={selectedMonth}
            >
              {nepaliMonths.map((month) => (
                <Option key={month.id} value={month.id}>
                  {month.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Row>
      <Table
        dataSource={students}
        columns={columns}
        pagination={false}
        scroll={{ x: "max-content" }}
        style={{ marginTop: "20px" }}
        loading={isLoading}
      />
      <Row justify="right" style={{ marginTop: "20px" }}>
        <Col>
          <Button type="primary" onClick={prepareAndSaveAttendanceChanges}>
            Save Attendance
          </Button>
        </Col>
      </Row>
    </div>
  );
}

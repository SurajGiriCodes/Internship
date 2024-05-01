import React, { useContext, useEffect, useState } from "react";
import { ClassRoomContext } from "../../Context/ClassRoomContext";
import { Form, Select, Row, Col, Table, Button } from "antd";

export default function Routine() {
  const { ClassRoomData } = useContext(ClassRoomContext);
  const [days, setDays] = useState([]);
  const [data, setData] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(13);
  const [teachers, setTeachers] = useState([]);
  const [classroomRoutine, setClassroomRoutine] = useState([]);

  // Define fetchData function outside useEffect
  const fetchData = async () => {
    if (selectedClassId) {
      const url = `https://core.school.wtech.com.np/api/classroom/classroomroutine/?classroom_id=${selectedClassId}`;
      const accessToken = localStorage.getItem("accessToken");
      try {
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!response.ok) {
          throw new Error("Network response was not OK");
        }
        const apiData = await response.json();
        setDays(apiData.month_days.map((dayArray) => dayArray[1]));
        setSubjects(apiData.AY_classroom_subject);
        setTeachers(apiData.teachers);
        setClassroomRoutine(apiData.classroom_routine);
        transformData(apiData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedClassId]);

  const columns = [
    {
      title: "Time/Day",
      dataIndex: "time",
      key: "time",
    },
    // Columns for days dynamically generated based on state
    ...days.map((day) => ({
      title: day,
      dataIndex: day,
      key: day,
      render: (_, record) => (
        <div
          style={{ display: "flex", flexDirection: "column", marginBottom: 8 }}
        >
          <Select
            placeholder="Subject"
            style={{ width: 150, marginBottom: 8 }}
            value={record[day]?.subjectId}
            onChange={(value) =>
              handleSelectionChange(value, day, record.key, "subject")
            }
          >
            {subjects.map((subject) => (
              <Select.Option key={subject.id} value={subject.id}>
                {subject.subject_name}
              </Select.Option>
            ))}
          </Select>
          <Select
            placeholder="Teacher"
            style={{ width: 150 }}
            value={record[day]?.teacherId}
            onChange={(value) =>
              handleSelectionChange(value, day, record.key, "teacher")
            }
          >
            {teachers.map((teacher) => (
              <Select.Option key={teacher.id} value={teacher.id}>
                {`${teacher.first_name} ${teacher.last_name}`.trim()}
              </Select.Option>
            ))}
          </Select>
        </div>
      ),
    })),
  ];

  function transformData(apiData) {
    // Map each time period to its initial data structure
    const initialTimePeriods = apiData.classroom_timeperoid.map((period) => ({
      key: period.id,
      time: period.time_period,
      // Prepare each day with placeholders for subject and teacher
      ...apiData.month_days.reduce(
        (acc, [_, day]) => ({
          ...acc,
          [day]: { subject: undefined, teacher: undefined },
        }),
        {}
      ),
    }));

    // Incorporate classroom_routine into the initialTimePeriods structure
    apiData.classroom_routine.forEach((routine) => {
      const timePeriodIndex = initialTimePeriods.findIndex(
        (period) => period.key === routine.classroom_timeperiod_id
      );
      if (timePeriodIndex !== -1) {
        const dayName = apiData.month_days.find(
          ([abbr, _]) => abbr === routine.weekday
        )[1];
        if (dayName) {
          // Update the relevant day in the timePeriod structure with the selected subject and teacher
          initialTimePeriods[timePeriodIndex][dayName] = {
            subjectId: routine.classroom_subject_id, // Directly set subjectId
            teacherId: routine.teacher_id, // Directly set teacherId
          };
        }
      }
    });

    setData(initialTimePeriods);
  }

  const handleSelectionChange = (value, day, key, field) => {
    const newData = [...data];
    const index = newData.findIndex((item) => item.key === key);
    if (index !== -1) {
      // Assuming `value` is the ID for subjects and teachers
      // For subjects and teachers, ensure value is their ID
      newData[index][day][field + "Id"] = value; // Store as subjectId or teacherId
      setData(newData);
    }
  };

  const handleClassChange = (value) => {
    setSelectedClassId(value);
  };

  const onSave = async () => {
    let changesMade = false;

    // Check if any changes have been made
    data.forEach((period) => {
      days.forEach((dayName) => {
        const entry = period[dayName];
        if (
          entry &&
          (entry.subjectId !== undefined || entry.teacherId !== undefined)
        ) {
          const originalEntry = classroomRoutine.find(
            (routine) =>
              routine.classroom_timeperiod_id === period.key &&
              routine.weekday === dayName.substring(0, 3).toLowerCase()
          );
          if (
            !originalEntry ||
            originalEntry.classroom_subject_id !== entry.subjectId ||
            originalEntry.teacher_id !== entry.teacherId
          ) {
            changesMade = true;
          }
        }
      });
    });

    // If no changes have been made, refetch the data
    if (!changesMade) {
      fetchData();
      return;
    }

    // If changes have been made, proceed to save the data
    const changedData = data
      .flatMap((period) =>
        days.map((dayName) => {
          const entry = period[dayName];
          if (
            !entry ||
            (entry.subjectId === undefined && entry.teacherId === undefined)
          ) {
            return null;
          }

          const originalEntry = classroomRoutine.find(
            (routine) =>
              routine.classroom_timeperiod_id === period.key &&
              routine.weekday === dayName.substring(0, 3).toLowerCase()
          );

          const changed =
            !originalEntry ||
            originalEntry.classroom_subject_id !== entry.subjectId ||
            originalEntry.teacher_id !== entry.teacherId;

          if (changed) {
            return {
              classroom_routine_id: originalEntry ? originalEntry.id : null,
              classroom_timeperiod_id: period.key,
              teacher_id: entry.teacherId,
              classroom_subject_id: entry.subjectId,
              weekday: dayName.substring(0, 3).toLowerCase(),
              classroom_id: selectedClassId,
            };
          }
          return null;
        })
      )
      .filter((entry) => entry !== null);
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await fetch(
        "https://core.school.wtech.com.np/api/classroom/classroomroutine/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(changedData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const responseData = await response.json();
      fetchData();
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Form.Item label="Class">
          <Select
            placeholder="Select a class"
            style={{ width: 200 }}
            onChange={handleClassChange}
            value={selectedClassId}
          >
            {Array.isArray(ClassRoomData) &&
              ClassRoomData.map((classItem) => (
                <Select.Option key={classItem.id} value={classItem.id}>
                  {`${classItem.predefined_class_name} (${classItem.name}) - ${classItem.shift_name}`}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: "max-content" }}
      />
      <Row justify="right" style={{ marginTop: "20px" }}>
        <Col>
          <Button type="primary" onClick={onSave}>
            Save
          </Button>
        </Col>
      </Row>
    </>
  );
}

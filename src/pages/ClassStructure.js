import React, { useEffect, useState } from "react";
import { Card, Space, Button, Modal, Input, Select, Table } from "antd";

const ClassStructure = () => {
  const [shifts, setShifts] = useState([]);
  const [isShiftModalVisible, setIsShiftModalVisible] = useState(false);
  const [isClassModalVisible, setIsClassModalVisible] = useState(false);
  const [isSectionModalVisible, setIsSectionModalVisible] = useState(false);
  const [newShiftName, setNewShiftName] = useState("");
  const [newClassName, setNewClassName] = useState("");
  const [newSectionName, setNewSectionName] = useState("");
  const [selectedClassIndex, setSelectedClassIndex] = useState(null);
  const { Option } = Select;

  useEffect(() => {
    console.log("Updated shifts:", shifts);
  }, [shifts]);

  const handleAddShift = () => {
    setIsShiftModalVisible(true);
  };

  const handleShiftModalOk = () => {
    if (newShiftName.trim() !== "") {
      setShifts([...shifts, { shift: newShiftName, classes: [] }]);
      setNewShiftName(""); //effectively clearing the input field
      setIsShiftModalVisible(false);
    }
  };

  const handleShiftModalCancel = () => {
    setNewShiftName("");
    setIsShiftModalVisible(false);
  };

  const handleAddClass = () => {
    setIsClassModalVisible(true);
  };

  const handleClassModalOk = () => {
    if (newClassName.trim() !== "") {
      setShifts((prevShifts) => {
        const newShifts = [...prevShifts];
        const lastShiftIndex = newShifts.length - 1; //It finds the index of the last shift in the array. because//it would be challenging to identify which shift in the array should receive the new class.
        newShifts[lastShiftIndex].classes.push({
          className: newClassName,
          sections: [],
        });

        return newShifts;
      });

      setNewClassName("");
      setIsClassModalVisible(false);
    }
  };

  const handleClassModalCancel = () => {
    setNewClassName("");
    setIsClassModalVisible(false);
  };

  const handleAddSection = (classIndex) => {
    setSelectedClassIndex(classIndex);
    setIsSectionModalVisible(true);
  };

  const handleSectionModalOk = () => {
    if (newSectionName.trim() !== "" && selectedClassIndex !== null) {
      setShifts((prevShifts) => {
        const newShifts = [...prevShifts];
        const lastShiftIndex = newShifts.length - 1;

        newShifts[lastShiftIndex].classes[selectedClassIndex].sections.push({
          sectionName: newSectionName,
        });

        return newShifts;
      });

      setNewSectionName("");
      setSelectedClassIndex(null);
      setIsSectionModalVisible(false);
    }
  };

  const handleSectionModalCancel = () => {
    setNewSectionName("");
    setSelectedClassIndex(null);
    setIsSectionModalVisible(false);
  };

  // Convert shifts to the desired structure
  const transformedData = shifts.reduce((result, shift) => {
    const { shift: shiftName, classes } = shift;
    result[shiftName.toLowerCase()] = {};
    classes.forEach((cls) => {
      const { className, sections } = cls;
      result[shiftName.toLowerCase()][className] = sections.map(
        (section) => section.sectionName
      );
    });
    return result;
  }, {});

  console.log("Transformed data:", transformedData);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Space direction="vertical" size={16}>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingBottom: "10px",
          }}
        >
          <Button type="primary" onClick={handleAddShift}>
            Add Shift
          </Button>
        </div>

        {shifts.map((shift, shiftIndex) => (
          <Card
            key={shiftIndex}
            title={shift.shift}
            extra={
              <Button type="primary" onClick={handleAddClass}>
                Add Class
              </Button>
            }
            style={{
              width: 800,
              background: "#DCDCDC",
            }}
          >
            {/* Class section */}
            <Space>
              <Table
                dataSource={shift.classes.map((cls, classIndex) => ({
                  key: classIndex,
                  className: cls.className,
                  sections: cls.sections.map((section) => section.sectionName),
                }))}
                columns={[
                  {
                    title: "Class Name",
                    dataIndex: "className",
                    key: "className",
                    align: "center",
                  },
                  {
                    title: "Sections",
                    dataIndex: "sections",
                    key: "sections",
                    align: "center",
                    render: (sections) => (
                      <div style={{ whiteSpace: "nowrap", overflow: "hidden" }}>
                        {sections.map((section, sectionIndex) => (
                          <span
                            key={sectionIndex}
                            style={{ marginRight: "8px" }}
                          >
                            {section}
                          </span>
                        ))}
                      </div>
                    ),
                  },
                  {
                    title: "Add Section",
                    key: "action",
                    align: "center",
                    render: (_, record) => (
                      <Button
                        type="primary"
                        style={{
                          backgroundColor: "#6495ED",
                          color: "#F5F5DC",
                        }}
                        onClick={() => handleAddSection(record.key)}
                      >
                        Add Section
                      </Button>
                    ),
                  },
                ]}
                pagination={false}
                style={{ width: "750px" }}
              />
            </Space>
          </Card>
        ))}
        <Modal
          title="Enter Shift Name"
          visible={isShiftModalVisible}
          onOk={handleShiftModalOk}
          onCancel={handleShiftModalCancel}
        >
          <Input
            placeholder="Enter shift name"
            value={newShiftName}
            onChange={(e) => setNewShiftName(e.target.value)}
          />
        </Modal>
        <Modal
          title="Enter Class Name"
          visible={isClassModalVisible}
          onOk={handleClassModalOk}
          onCancel={handleClassModalCancel}
        >
          <Input
            placeholder="Enter class name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
        </Modal>
        <Modal
          title="Select Section"
          visible={isSectionModalVisible}
          onOk={handleSectionModalOk}
          onCancel={handleSectionModalCancel}
        >
          <Select
            showSearch
            style={{ width: "100%" }}
            placeholder="Select section"
            optionFilterProp="children"
            value={newSectionName}
            onChange={(value) => setNewSectionName(value)}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            <Option value="A">A</Option>
            <Option value="B">B</Option>
            <Option value="C">C</Option>
            <Option value="D">D</Option>
            <Option value="E">E</Option>
            {/* Add more options as needed */}
          </Select>
        </Modal>
      </Space>
    </div>
  );
};

export default ClassStructure;

import React, { createContext, useState, useEffect } from "react";

export const ClassRoomContext = createContext(null);

export const ClassRoomProvider = ({ children }) => {
  const [ClassRoomData, setClassRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://core.school.wtech.com.np/api/school/classroom/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const result = await response.json();
        setClassRoomData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <ClassRoomContext.Provider value={{ ClassRoomData, isLoading, error }}>
      {children}
    </ClassRoomContext.Provider>
  );
};

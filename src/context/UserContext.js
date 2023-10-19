import React, { useContext, useState } from "react";

const UserContext = React.createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export function UserProvider({ children }) {
  const [editData, setEditData] = useState(null);
  return (
    <UserContext.Provider value={{ editData, setEditData }}>
      {children}
    </UserContext.Provider>
  );
}



// const createList = async (data) => {
//   const response = await fetch(
//     "https://crudcrud.com/api/99ee82ab82c140bb94818e1898aeb39e/data",
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data), // Send data directly, not within an object
//     }
//   );
//   const responseData = await response.json();
//   console.log("Data created successfully:", responseData);
// };

// const contextData = {
//   createList: createList,
// };

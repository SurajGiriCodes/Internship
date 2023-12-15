import React from "react";
import { Routes, Route } from "react-router-dom";
import Table from "./pages/StuTable";
import ThemeProvider from "./ThemeProvider";
import "./App.css";
import Navbar from "./components/Navbar";
import ClassStructure from "./pages/ClassStructure";
import Login from "./pages/Login";

function App() {
  return (
    // <ThemeProvider>
    //   {({ theme, toggleTheme }) => (
    //     <div id={theme}>
    //       <Navbar toggleTheme={toggleTheme} />
    //       <Routes>
    //         <Route path="/" element={<Navbar />}>
    //           <Route path="table" element={<Table />} />
    //         </Route>
    //       </Routes>
    //     </div>
    //   )}
    // </ThemeProvider>
    // <ClassStructure />
    <Login />
  );
}

export default App;

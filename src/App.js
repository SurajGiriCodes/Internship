import "./App.css";
import { Routes, Route } from "react-router-dom";
import Create from "./pages/Create/Create";
import Table from "./pages/StuTable";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Table />} />
        <Route path="/create" element={<Create />} />
      </Routes>
    </div>
  );
}

export default App;

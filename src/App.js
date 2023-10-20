import "./App.css";
import { Routes, Route } from "react-router-dom";
import Table from "./pages/StuTable";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Table />} />
      </Routes>
    </div>
  );
}

export default App;

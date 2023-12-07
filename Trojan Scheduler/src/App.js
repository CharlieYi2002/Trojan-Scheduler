import React, { useState } from "react";
import "./styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClassInput from "./ClassInput";
import NAV from "./NAV";
import Coursebin from "./Coursebin";

export default function App() {
  const [addedClasses, setAddedClasses] = useState([]);

  const addToCourseBin = (classInfo) => {
    // Update the added classes state
    setAddedClasses([...addedClasses, classInfo]);
  };

  const handleDeleteClass = (classId) => {
    // Filter out the class with the specified identifier
    const updatedClasses = addedClasses.filter(
      (classInfo) => classInfo.id !== classId,
    );

    // Update the state with the remaining classes
    setAddedClasses(updatedClasses);
  };

  return (
    <div className="App">
      <Router>
        <NAV />
        <Routes>
          <Route
            index
            element={<ClassInput addToCourseBin={addToCourseBin} />}
          />
          <Route
            path="/Coursebin"
            element={
              <Coursebin
                addedClasses={addedClasses}
                onDeleteClass={handleDeleteClass}
              />
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

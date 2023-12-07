import React from "react";
import "./styles.css";

export default function Coursebin({ addedClasses }) {
  return (
    <div>
      <h1>Courses</h1>
      <ul>
        {addedClasses &&
          addedClasses.map((classInfo, index) => (
            <li key={index}>
              {classInfo.details.course_id} {classInfo.details.name} Session ID:{" "}
              {classInfo.details.id}
              <div>
                Instructor: {classInfo.details.instructor}, Schedule:{" "}
                {classInfo.details.time} {classInfo.details.days}, Units:{" "}
                {classInfo.details.units}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

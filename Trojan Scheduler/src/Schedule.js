// Schedule.js
import React, { useState, useEffect } from "react";
import "./styles.css";
import { queryCS102Classes } from "./DynamoDBComponent";

export default function Schedule() {
  const [dynamoData, setDynamoData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await queryCS102Classes(); // Use the correct function name
        setDynamoData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Function to transform data into a dictionary with course_id as the key
  const transformDataToDictionary = (data) => {
    const dictionary = {};
    data.forEach((item) => {
      dictionary[item.course_id] = item;
    });
    return dictionary;
  };

  const dictionaryData = dynamoData
    ? transformDataToDictionary(dynamoData)
    : null;

  return (
    <div>
      <h1>Schedule</h1>
      {dictionaryData && <pre>{JSON.stringify(dictionaryData, null, 2)}</pre>}
    </div>
  );
}

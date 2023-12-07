import React, { useState, useEffect } from "react";
import neo4jDriver from "./neo4j"; // Adjust the path accordingly
import "./styles.css";
import Neo4jC from "./Neo4jC";
import { queryCS102Classes } from "./DynamoDBComponent";
import Coursebin from "./Coursebin";

const ClassInput = ({ addToCourseBin }) => {
  const [selectedClasses, setSelectedClasses] = useState([]);
  const [completedClass, setCompletedClass] = useState("");
  const [enteredClasses, setEnteredClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [dynamoData, setDynamoData] = useState(null);
  const [addedClasses, setAddedClasses] = useState([]);

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

  const handleClassInputChange = (e) => {
    setCompletedClass(e.target.value);
  };

  const handleAddClass = async () => {
    if (completedClass.trim() !== "") {
      let session;

      try {
        session = neo4jDriver.session();

        // Cypher query to create HAS_TAKEN relationship
        const createHasTakenQuery = `
          MATCH (s:Student {name: "User"})
          MATCH (c:Class {number: $completedClass})
          CREATE (s)-[:HAS_TAKEN]->(c)
        `;

        const createHasTakenParameters = {
          completedClass: completedClass.trim(),
        };
        await session.run(createHasTakenQuery, createHasTakenParameters);

        console.log(
          `Relationship 'HAS_TAKEN' created for ${completedClass.trim()}`,
        );
      } catch (error) {
        console.error("Error creating HAS_TAKEN relationship:", error);
      } finally {
        if (session) {
          session.close();
        }
      }

      setEnteredClasses([...enteredClasses, completedClass.trim()]);
      setCompletedClass("");
    }
  };

  const handleClassSubmit = async () => {
    let session;

    try {
      session = neo4jDriver.session();

      // Cypher query to fetch eligible classes based on completed classes
      const cypherQuery1 = `
        MATCH (s:Student {name: "User"})
        OPTIONAL MATCH (s)-[:HAS_TAKEN]->(:Class)-[:PREREQ_OF]->(c:Class)
        WHERE NOT (s)-[:HAS_TAKEN]->(c)
        WITH COLLECT(DISTINCT c) AS distinctClasses
        UNWIND distinctClasses AS c
        RETURN c
      `;

      const cypherQuery2 = `
        MATCH (c:Class)
        WHERE NOT (c)<-[:PREREQ_OF]-(:Class)
        RETURN DISTINCT c
      `;

      const cypherQuery = `${cypherQuery1} UNION ${cypherQuery2}`;

      const result = await session.run(cypherQuery);

      const neo4jSelectedClasses = result.records.map(
        (record) => record.get("c").properties,
      );

      console.log("Neo4j Eligible Classes:", neo4jSelectedClasses);

      // Filter eligible classes based on the DynamoDB data dictionary
      const filteredClasses = neo4jSelectedClasses.filter((classInfo) => {
        if (dictionaryData && dictionaryData[classInfo.number]) {
          return true;
        } else {
          console.log("ClassInfo not found in DynamoDB:", classInfo.number);
          return false;
        }
      });

      console.log("Filtered Classes:", filteredClasses);

      // Set the state after the data has been fetched
      setFilteredClasses(filteredClasses);
    } catch (error) {
      console.error("Error fetching eligible classes:", error);
    } finally {
      if (session) {
        session.close();
      }
    }
  };

  const handleResetCourses = async () => {
    let session;

    try {
      session = neo4jDriver.session();

      // Cypher query to delete all HAS_TAKEN relationships for the user
      const resetCoursesQuery = `
        MATCH (s:Student {name: "User"})-[r:HAS_TAKEN]->(c:Class)
        DELETE r
      `;

      await session.run(resetCoursesQuery);

      console.log("All HAS_TAKEN relationships deleted");
    } catch (error) {
      console.error("Error deleting HAS_TAKEN relationships:", error);
    } finally {
      if (session) {
        session.close();
      }
    }
    // reset states
    setEnteredClasses([]);
    setSelectedClasses([]);
    setFilteredClasses([]);
  };

  const handleAddToCourseBin = (classInfo) => {
    const enrichedClassInfo = {
      details: dictionaryData[classInfo.number],
    };

    // Call the function passed from the parent component to update the added classes
    addToCourseBin(enrichedClassInfo);
  };

  return (
    <div>
      <h1>Enter Completed Classes</h1>
      <input
        type="text"
        placeholder="Enter completed classes"
        value={completedClass}
        onChange={handleClassInputChange}
      />
      <button onClick={handleAddClass}>Add Class</button>

      <h1>Entered Classes:</h1>
      <ul>
        {enteredClasses.map((enteredClass, index) => (
          <li key={index}>{enteredClass}</li>
        ))}
      </ul>

      <button onClick={handleClassSubmit}>Search Classes</button>
      <button onClick={handleResetCourses}>Reset Courses</button>

      <h1>Eligible Classes:</h1>
      <ul>
        {filteredClasses.map((classInfo, index) => (
          <li key={index}>
            <div>
              {dictionaryData[classInfo.number].course_id}{" "}
              {dictionaryData[classInfo.number].name} Session ID:
              {dictionaryData[classInfo.number].id} Status:
              {dictionaryData[classInfo.number].status}
              <div>
                Instructor: {dictionaryData[classInfo.number].instructor},
                Schedule: {dictionaryData[classInfo.number].time}{" "}
                {dictionaryData[classInfo.number].days}, Units:{" "}
                {dictionaryData[classInfo.number].units}
              </div>
              <button onClick={() => handleAddToCourseBin(classInfo)}>
                Add
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Neo4jC />
    </div>
  );
};

export default ClassInput;

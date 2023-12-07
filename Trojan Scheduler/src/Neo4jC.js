import React, { useState, useEffect } from "react";
import neo4jDriver from "./neo4j";

const Neo4jC = () => {
  const [allNodes, setAllNodes] = useState([]);

  useEffect(() => {
    const fetchAllNodes = async () => {
      let session;

      try {
        session = neo4jDriver.session();

        // Cypher query to fetch all nodes
        const cypherQuery = "MATCH (n) RETURN n";

        const result = await session.run(cypherQuery);

        const nodes = result.records.map(
          (record) => record.get("n").properties,
        );

        // Update the state with all nodes
        setAllNodes(nodes);
      } catch (error) {
        console.error("Error fetching all nodes:", error);
      } finally {
        if (session) {
          session.close();
        }
      }
    };

    fetchAllNodes();
  }, []);

  return (
    <div>
      <h1>All Classes in ECDS Track</h1>
      <ul>
        {allNodes
          .filter((node) => node.name !== "User") // Filter out items with name "user"
          .map((node, index) => (
            <li key={index}>
              <div>
                <strong>Course:</strong> {node.number} {node.name}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Neo4jC;

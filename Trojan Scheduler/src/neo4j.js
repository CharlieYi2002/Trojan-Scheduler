import neo4j from 'neo4j-driver';

const NEO4J_URI = 'neo4j+s://a2b99649.databases.neo4j.io';
const NEO4J_USERNAME = 'neo4j';
const NEO4J_PASSWORD = 'hg7gtOTVQt2j9aRRAZUUhZlaaqnBu5-YRVSl_KL2iBs';

const driver = neo4j.driver(NEO4J_URI, neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD));

export default driver;
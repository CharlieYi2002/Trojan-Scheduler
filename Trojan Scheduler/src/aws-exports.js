const awsmobile = {
  aws_project_region: "us-east-2",
  aws_dynamodb_all_tables_region: "us-east-2",
  aws_dynamodb_table_schemas: [
    {
      tableName: "trojan_scheduler",
      region: "us-east-2",
      definition: {
        primaryKey: {
          name: "id",
          type: "S",
        },
      },
    },
  ],
};

export default awsmobile;

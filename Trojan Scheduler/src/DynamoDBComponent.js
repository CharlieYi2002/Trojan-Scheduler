// DynamoDBComponent.js
import AWS from "aws-sdk";

AWS.config.update({
  region: "us-east-2",
  accessKeyId: "AKIAY6NGEQ2CMAVR3WIK",
  secretAccessKey: "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",
});

const docClient = new AWS.DynamoDB.DocumentClient();

export const queryCS102Classes = async () => {
  const params = {
    TableName: "trojan_scheduler",
  };

  try {
    const data = await docClient.scan(params).promise();
    console.log("Success", data.Items);
    return data.Items;
  } catch (err) {
    console.error("Error", err);
    throw err;
  }
};

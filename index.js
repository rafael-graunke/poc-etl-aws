const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3"); 
const config = require("./config.json");
const crypto = require('crypto');

module.exports.handler = async (event) => {
  // Buscar do endpoint
  const response = await fetch(config.API_ENDPOINT);
  const body = await response.json();
  const json = JSON.stringify(body);

  // Envia para S3
  const client = new S3Client();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0]; // Considera apenas date
  const uniqueIdentifier = `${todayStr}-${crypto.randomUUID()}.json`;

  const input = {
    Bucket: config.S3_BUCKET_NAME,
    Key: `raw/${uniqueIdentifier}`,
    Body: json,
    ContentType: "application/json; charset=utf-8"
  }

  const command = new PutObjectCommand(input);
  return await client.send(command);
};


import { Client, Account } from "appwrite";

/**
 * Initialization (Configuring) of appwrite SDK by providing endpoint and project id.
 */
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("[PROJECT_ID]"); // Your project ID

/**
 * Initialization (Configuring) of appwrite Account SDK.
 * Account initialization using SDK configuration to access appwrite services.
 */
const account = new Account(client);

export default account;

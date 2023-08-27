import { Client, Account } from "appwrite";

/**
 * Initialization (Configuring) of appwrite SDK by providing endpoint and project id.
 */
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("64e8395f88b2c38e0dbc"); // Your project ID

/**
 * Initialization (Configuring) of appwrite Account SDK.
 * Account initialization using SDK configuration to access appwrite services.
 */
const account = new Account(client);

export default account;

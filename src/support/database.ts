async function deleteAndCreateDatabase(client:any, name:any) {
  const database = await handleSetupError(
    client.query(
      Do(
        If(Exists(Database(name)), Delete(Database(name)), false),
        CreateDatabase({ name: name })
      )
    ),
    "Deleting and recreate database for:" + name
  );
  const adminKey = await handleSetupError(
    client.query(CreateKey({ database: database.ref, role: "admin" })),
    "Create Admin key for db"
  );
  return adminKey.secret;
}

async function setupDatabase(client:faunadb.Client) {
  await handleSetupError(createCollection(client), "things collection");
}

export { deleteAndCreateDatabase, setupDatabase };
import faunadb from "faunadb";
import { createCollection } from "../create.js";
import { handleSetupError } from "./errors.js";
const q = faunadb.query;
const { If, Exists, Database, CreateDatabase, CreateKey, Delete, Do } = q;
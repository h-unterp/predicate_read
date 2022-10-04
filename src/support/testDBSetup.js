import "dotenv/config";
export const generalTestSetup = async function (dbName) {
  console.log(`----- ${dbName} -----`);
  var args = minimist(process.argv.slice(2));
  // First create database to run this test in.
  const adminClientParentDb = new faunadb.Client({
    secret: process.env.ADMIN_KEY,
    domain: "db.us.fauna.com",
  });

  if (args.fullSetup) {
    // Create the admin client for the new database to bootstrap things
    const secret = await handlePromiseError(
      deleteAndCreateDatabase(adminClientParentDb, dbName),
      `Creating ${dbName} database`
    );
    await countdown("Countdown Post Destroy", 61).then(() => {
      console.log("FINISHED COUNTDOWN");
    });
  }

  const adminKey = await handleSetupError(
    adminClientParentDb.query(
      CreateKey({ database: q.Database(dbName), role: "admin" })
    ),
    "Admin key - child db"
  );

  var adminClient = new faunadb.Client({
    secret: adminKey.secret,
    domain: "db.us.fauna.com",
  });

  if (args.setup || args.fullSetup) {
    // Setup the database for this test.
    await handlePromiseError(setupDatabase(adminClient), "Setup Database");
    process.exit(0);
  }

  //deletes all data in the database but not indexes/functions/etc.
  await handlePromiseError(deleteAll(adminClient), "Delete All");

  return adminClient;
};

import faunadb from "faunadb";
const q = faunadb.query;
const { CreateKey } = q;
import "dotenv/config";
import {
  setupDatabase,
  deleteAndCreateDatabase,
} from "./database.js";
import {
  handlePromiseError,
  handleSetupError,
} from "./errors.js";
import { deleteAll } from "./clearData.js";
import countdown from "t-minus-logger";
import minimist from "minimist";
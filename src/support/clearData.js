export const deleteAll = async (client, childDbName) => {
  // If this option is provided, the db will be created as a child db of the database
  // that the above admin key belongs to. This is useful to destroy/recreate a database
  // easily without having to wait for cache invalidation of collection/index names.
  // In this case, we can just nuke the database completely.

  if (typeof childDbName !== "undefined" && childDbName !== "") {
    // clean keys that are linked to this database
    await handleSetupError(
      client.query(
        Map(Paginate(Documents(Keys())), (x) =>
          Let(
            {
              key: Get(x),
              ref: Select(["ref"], Var("key")),
              db: Select(["database"], Var("key"), "none"),
            },
            If(
              Equals(Var("db"), Database(childDbName)),
              Delete(Var("ref")),
              false
            )
          )
        )
      ),
      "delete keys - delete keys linked to database"
    );
    await handleSetupError(
      client.query(
        If(Exists(Database(childDbName)), Delete(Database(childDbName)), false)
      ),
      "database - delete child database"
    );
  } else {
    try {
      await DeleteAll(client);
      console.log(`Deleted else: all`);
    } catch (err) {
      console.log("Error", err);
    }
  }
};

export const DeleteAll = async (client) => {
  return client.query(
    Map(
      Paginate(Collections()),
      Lambda(
        "ref",
        Map(
          Paginate(q.Documents(Var("ref"))),
          Lambda("ref2", Delete(Var("ref2")))
        )
      )
    )
  );
};

export const DeleteAllUsers = async (client) => {
  return client.query(
    Map(Paginate(q.Documents(Collection('users'))), Lambda("ref2", Delete(Var("ref2"))))
  );
};

import "dotenv/config";
import { handleSetupError } from "./errors.js";
import faunadb from "faunadb";
const q = faunadb.query;
const {
  Exists,
  If,
  Database,
  Map,
  Collections,
  Collection,
  Documents,
  Paginate,
  Lambda,
  Delete,
  Var,
  Let,
  Get,
  Select,
  Equals,
  Keys,
} = faunadb.query;
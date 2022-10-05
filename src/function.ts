import faunadb from "faunadb";
import "dotenv/config";
import { TestRoles } from "./roles";
import { TestIndexes } from "./create";
const q = faunadb.query;
const { Get, Match, Index, Update, CreateFunction, Query, CurrentIdentity, If, Exists, Lambda, Role } = q;
const CreateOrUpdateFunction = function (obj: any) {
  return If(
    Exists(q.Function(obj.name)),
    Update(q.Function(obj.name), { body: obj.body, role: obj.role }),
    CreateFunction({ name: obj.name, body: obj.body, role: obj.role })
  );
};

export const enum TestFunctions {
  FnUnrestrictedRead = "fn_unrestricted_read",
  FnCollectionPredicate = "fn_collection_predicate"
}
//
// FnUnrestrictedRead
//

const FnUnrestrictedRead = function () {
  return Get(Match(Index(TestIndexes.InfoByUserRef), CurrentIdentity()));
};

export const CreateUnrestrictedReadUDF = CreateOrUpdateFunction({
  name: TestFunctions.FnUnrestrictedRead,
  body: Query(Lambda("ref", FnUnrestrictedRead())),
  role: Role(TestRoles.UnrestrictedRead),
});

//
// FnCollectionPredicate
//

const FnCollectionPredicate = function () {
  return Get(Match(Index(TestIndexes.InfoByUserRef), CurrentIdentity()));
};

export const CreateCollectionPredicateUDF = CreateOrUpdateFunction({
  name: TestFunctions.FnCollectionPredicate,
  body: Query(Lambda("ref", FnCollectionPredicate())),
  role: Role(TestRoles.CollectionPredicate),
});
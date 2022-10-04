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
  LetItBe = "let_it_be",
}

const LetItBe = function () {
  return Get(Match(Index(TestIndexes.InfoByUserRef), CurrentIdentity()));
};

export const CreateUDF = CreateOrUpdateFunction({
  name: TestFunctions.LetItBe,
  body: Query(Lambda("ref", LetItBe())),
  role: Role(TestRoles.AllUsers),
});

import faunadb from "faunadb";
import {
  InfoModel,TestCollections, TestIndexes
} from "./create";
import { TestFunctions } from "./function";
const q = faunadb.query;
const {
  Equals, CurrentIdentity,
  Query, Lambda,
  Select, Get,
  Var,
  Index, Update, CreateRole, Collection, If, Exists, Role, Function } = q;


export const enum TestRoles {
  UnrestrictedRead = "unrestricted_read",
  CollectionPredicate = "collection_predicate",
  FunctionRole = "function_role",
}

// A convenience function to either create or update a role.
export const CreateOrUpdateRole = function (obj: any) {
  //Update still blasts the priveleges from the previous role.
  //probably useless as is. -HP Sep 2022

  return If(
    Exists(Role(obj.name)),
    Update(Role(obj.name), {
      membership: obj.membership,
      privileges: obj.privileges,
    }),
    CreateRole(obj)
  );
};

export const CreateRoleUnrestrictedRead = CreateOrUpdateRole({
  name: TestRoles.UnrestrictedRead,
  membership: [{ resource: Collection(TestCollections.Users) }],
  privileges: [
    {
      resource: Collection(TestCollections.Users),
      actions: { read: true },
    },
    {
      resource: Index(TestIndexes.InfoByUserRef),
      actions: {
        unrestricted_read: Query(
          Lambda(
            ["ref"],
            Equals(Var("ref"), CurrentIdentity())
          ))
      },
    },
    {
      resource: Collection(TestCollections.Info),
      actions: {
        read: true,
        write: true,
      },
    },
  ],
});

export const CreateRoleCollectionPredicate = CreateOrUpdateRole({
  name: TestRoles.CollectionPredicate,
  membership: [{ resource: Collection(TestCollections.Users) }],
  privileges: [
    {
      resource: Collection(TestCollections.Users),
      actions: { read: true },
    },
    {
      resource: Index(TestIndexes.InfoByUserRef),
      actions: {
        read: true,
      },
    },
    {
      resource: Collection(TestCollections.Info),
      actions: {
        //read predicate: A reference to the document to be read,
        read: Query(
          Lambda(
            ["ref"],

            //this works when run from UDF
            //true

            //this fails when run from UDF
            //Equals(CurrentIdentity(), CurrentIdentity()),

            //this is the actual goal, but also fails to only allow the user to read their own info
            //this fails when run from UDFM, but works when run from a query.
            Equals(Select(["data", InfoModel.userRef], Get(Var("ref"))), CurrentIdentity())
          )
        ),
        write: true,
      },
    },
  ],
});

export const CreateMembershipRoleAllUsersFn = CreateOrUpdateRole({
  name: TestRoles.FunctionRole,
  membership: [{ resource: Collection(TestCollections.Users) }],
  privileges: [
    /*{
      resource: Function(TestFunctions.FnUnrestrictedRead),
      actions: {
        call: true,
      },
    },*/
    {
      resource: Function(TestFunctions.FnCollectionPredicate),
      actions: {
        call: true,
      },
    },
  ],
});
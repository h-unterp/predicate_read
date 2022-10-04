
import faunadb from "faunadb";
import { TestCollections, TestIndexes } from "./create";
const q = faunadb.query;
const { Equals, CurrentIdentity, Index, Update, CreateRole, Query, Collection, If, Exists, Lambda, Role } = q;


export const enum Roles {
  AllUsers = 'allUsers',
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

export const CreateMembershipRoleAllUsers = CreateOrUpdateRole({
  name: Roles.AllUsers,
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
            ["vouchJoinRef"],
            //true
            Equals(CurrentIdentity(), CurrentIdentity())
            //Select(["data", VouchModel.userRef], Get(Var("vouchJoinRef"))))
          )
        ),
        write: true,
      },
    },
  ],
});

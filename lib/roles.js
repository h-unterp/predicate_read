import faunadb from "faunadb";
const q = faunadb.query;
const { Equals, CurrentIdentity, Index, Update, CreateRole, Query, Collection, If, Exists, Lambda, Role } = q;
// A convenience function to either create or update a role.
export const CreateOrUpdateRole = function (obj) {
    //Update still blasts the priveleges from the previous role.
    //probably useless as is. -HP Sep 2022
    return If(Exists(Role(obj.name)), Update(Role(obj.name), {
        membership: obj.membership,
        privileges: obj.privileges,
    }), CreateRole(obj));
};
export const CreateMembershipRoleAllUsers = CreateOrUpdateRole({
    name: "allUsers" /* Roles.AllUsers */,
    membership: [{ resource: Collection("users" /* TestCollections.Users */) }],
    privileges: [
        {
            resource: Collection("users" /* TestCollections.Users */),
            actions: { read: true },
        },
        {
            resource: Index("info_by_user_ref" /* TestIndexes.InfoByUserRef */),
            actions: {
                read: true,
            },
        },
        {
            resource: Collection("info" /* TestCollections.Info */),
            actions: {
                //read predicate: A reference to the document to be read,
                read: Query(Lambda(["vouchJoinRef"], 
                //true
                Equals(CurrentIdentity(), CurrentIdentity())
                //Select(["data", VouchModel.userRef], Get(Var("vouchJoinRef"))))
                )),
                write: true,
            },
        },
    ],
});
//# sourceMappingURL=roles.js.map
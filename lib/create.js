import faunadb from "faunadb";
const q = faunadb.query;
const { CreateCollection, CreateIndex, Collection, Exists, If, Index, } = q;
/* Collection */
const CreateUserCollection = CreateCollection({ name: "users" /* TestCollections.Users */ });
const CreateInfoCollection = CreateCollection({ name: "info" /* TestCollections.Info */ });
const CreateIndexInfoByUserRef = CreateIndex({
    name: "info_by_user_ref" /* TestIndexes.InfoByUserRef */,
    source: Collection("info" /* TestCollections.Info */),
    terms: [
        {
            field: ["data", "userRef" /* InfoModel.userRef */],
        },
    ],
    unique: true,
    values: [
        {
            field: ["ref"],
        },
    ],
});
export const createCollection = async function (client) {
    await client.query(If(Exists(Collection("info" /* TestCollections.Info */)), true, CreateInfoCollection));
    await client.query(If(Exists(Collection("users" /* TestCollections.Users */)), true, CreateUserCollection));
    await client.query(If(Exists(Index("info_by_user_ref" /* TestIndexes.InfoByUserRef */)), true, CreateIndexInfoByUserRef));
};
//# sourceMappingURL=create.js.map
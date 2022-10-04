import faunadb from "faunadb";
const q = faunadb.query;
const {
  CreateCollection,
  CreateIndex,
  Collection,
  Exists,
  If,
  Index,
} = q;

export const enum TestCollections {
  Users = 'users',
  Info = 'info',
}

export const enum TestIndexes {
  InfoByUserRef = 'info_by_user_ref',
}

export const enum InfoModel {
  userRef = 'userRef',
}

/* Collection */
const CreateUserCollection = CreateCollection({ name: TestCollections.Users });
const CreateInfoCollection = CreateCollection({ name: TestCollections.Info });

const CreateIndexInfoByUserRef = CreateIndex({
  name: TestIndexes.InfoByUserRef,
  source: Collection(TestCollections.Info),
  terms: [
    {
      field: ["data", InfoModel.userRef],
    },
  ],
  unique: true,
  values: [
    {
      field: ["ref"],
    },
  ],
});

export const createCollection = async function (client: faunadb.Client) {
  await client.query(
    If(Exists(Collection(TestCollections.Info)), true, CreateInfoCollection)
  );
  await client.query(
    If(Exists(Collection(TestCollections.Users)), true, CreateUserCollection)
  );

  await client.query(
    If(Exists(Index(TestIndexes.InfoByUserRef)), true, CreateIndexInfoByUserRef)
  );
};

import "dotenv/config";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { generalTestSetup } from "./support/testDBSetup.js";
import faunadb from "faunadb";
import { InfoModel, TestCollections, TestIndexes } from "./create.js";
import { TestFunctions } from "./function.js";
import { handlePromiseError } from "./support/errors.js";
const q = faunadb.query;
const { Let, Select, Create, Collection, Function, Login, Get, Var, Call, Match, Index, CurrentIdentity } = q;

chai.use(chaiAsPromised);
chai.should();

let user1: any;
let loggedInClient: faunadb.Client;
let adminClient: faunadb.Client;
let TOPIC = "predicate_repro";

function RegisterAndLogin() {
  const RegisterFQLStatement = Let(
    {
      user: Select(
        ["ref"],
        Create(Collection(TestCollections.Users), {
          credentials: { password: "1" },
        })
      ),
      info: Create(Collection(TestCollections.Info), {
        data: {
          [InfoModel.userRef]: Var("user"),
        }
      }),
      secret: Login(Var("user"), { password: "1" }),
    },
    { user: Get(Var("user")), secret: Var("secret") }
  );
  return RegisterFQLStatement;
}

describe(TOPIC, function () {
  before("this is before", async () => {
    adminClient = await generalTestSetup(TOPIC + "-spec");
    const res: any = await adminClient.query(RegisterAndLogin());
    user1 = res.user;
    loggedInClient = new faunadb.Client({
      secret: res.secret.secret,
      domain: "db.us.fauna.com",
    });
    loggedInClient = loggedInClient;
    user1 = user1;

  });

  it("The regular query passes", async function () {
    await loggedInClient.query(
      Get(Match(Index(TestIndexes.InfoByUserRef), CurrentIdentity()))
    ).then((res: any) => {
      console.log(res);
    });
  });

  it("The UDF fails", async function () {
    await handlePromiseError(loggedInClient.query(Call(Function(TestFunctions.LetItBe), user1.ref)).then((res: any) => {
      console.log(res);
    }));
  });
});

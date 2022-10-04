
import "dotenv/config";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { generalTestSetup } from "./support/testDBSetup.js";
import faunadb from "faunadb";
const q = faunadb.query;
const {} = q;

chai.use(chaiAsPromised);
chai.should();


let adminClient:faunadb.Client;
let TOPIC = "predicate_repro";

describe(TOPIC, function () {
  before("this is before", async () => {
    adminClient = await generalTestSetup(TOPIC + "-spec");
    adminClient = adminClient;
  });

  it("after works", async function () {
    
  });

});

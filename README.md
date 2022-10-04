***CurrentIdentity repro for read:predicate***

**Instructions:**

1. Supply admin key of an already existing DB in .env as ADMIN_KEY=
2. npm install
3. npm run testSetupFull:repro
4. npm run test:repro

* `test:repro` runs tests
* `testSetup:repro` will run creation script. should work except for indexes. 
* `testSetupRun:repro` will run creation script. and runs test after
* `testSetupFull:repro` destroys and recreates DB, for indexes.

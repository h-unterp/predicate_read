***Lightweight testing setup for fauna***

**Instructions:**

1. Supply admin key of an already existing DB in .env as ADMIN_KEY=
2. npm install
3. npm run testFullSetup:repro
4. npm run test:repro

`test:repro` runs tests

`testSetup:repro` will run creation script. should work except for indexes. 

`testFullSetup:repro` destroys and recreates DB, for indexes.

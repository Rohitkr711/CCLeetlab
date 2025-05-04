# LEETCODE CLONE LEC-1

#### System Architecture
[Arch Diagram](./diagram_lyst1745252581414.png)


###### 1. Implement the image store technique in this User model here using cloudinary or something else. ==(ASSIGNMENT)==
```bash
model User 
{
  id String @id @default(uuid())
  name String?
  email String @unique
  image String?
}
```
Here, 
- `@id: Marks it as the Primary Key (like PRIMARY KEY in SQL).`

- `@default(uuid()): Prisma will auto-generate a UUID (universally unique ID) for each user when inserted`
- UUID is 128 bits long and usually shown as a 32-character hexadecimal string separated by hyphens. like `f47ac10b-58cc-4372-a567-0e02b2c3d479`
- Main goal: Generate a unique value across different systems, servers, databases. Useful in uniquely identifying records like users, products, orders, etc.
- Useful When you don't want to rely on auto-incremented numbers (like 1,2,3…). And in distributed systems where multiple databases might create IDs independently.
- We saw UUID being used in User IDs in apps like Facebook, Instagram. In Session tokens, API keys. In File names (to avoid collisions). In Payment IDs, tracking numbers.

- `?` (question mark): Optional — meaning it can be NULL in the database.



###### 2. What does the npx prisma generate command do?
- It reads your schema.prisma file 📜. And creates a Prisma Client library 📦customized just for your database.
- After this command, you get auto-generated code inside a folder (usually node_modules/.prisma).
- You can then import this generated client into your Node.js code and start writing:
```bash
Example-

import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();
const users = await prisma.user.findMany();
```
- It only generates code, it does not touch your DB. You need to re-run prisma generate if you change your schema.prisma file.
- It creates a custom TypeScript/JavaScript client library and helps in auto-completion, type safety, faster development.

`Q) If you run npx prisma generate before creating a schema, what happens?`

- It will not work properly because, Prisma needs the schema.prisma file 📜 to know what to generate. If the schema is empty or missing, Prisma will show an error like
```bash
Error: Schema parsing
Cannot find a valid schema.prisma file
```
- So after generating prisma client we ==have an access of findUnique, findfirst etc. functions and properties.==

- Here `db` has the access of all funtions like findUnique, findMany etc.
```bash
import { PrismaClient } from "../generated/prisma/index.js";

const globalForPrisma=globalThis;
export const db=globalForPrisma.prisma|| new PrismaClient();
if(process.env.NODE_ENV !== "production") globalForPrisma.prisma=db;
```

###### 3. ==When to use each:==
`npx prisma migrate dev`: Use this during development to create, test, and apply migrations. This is ideal for local environments and early stages of development when you're still working on the schema.

`npx prisma migrate deploy/npx prisma db push`: Use this in production or staging environments where you want to apply a pre-generated set of migrations. This is used for deployments in a more controlled, production-ready scenario.


`In postgres prisma client automatically saves the newly created user into the database we don't need to specifically save it like we do in mongoose mongoDB.`
 
###### 4. Steps to check table's data of postgres db created using DOCKER (using CLI)
```bash
> docker ps
> docker exec -it postgres-container-name bash (it will open a bash shell into that container)
> psql -U postgres-DB-username (it will open postgres CLI)
> \l (shows all DBs)
> \c your_db_name (connects to your DB)
> \dt (list down all tables)
> \d "table-name" (shows table structure)
> SELECT * FROM "tablename" (shows all table data)
```
- Using `openssl rand -tokenformat tokensize` we can generate random token in gitbash terminal which we can use in jwt token or etc. 
Here, token-format could be like hex.


###### 5. When the actual table will be created into a database then inside problem table will there be a columns with name UserId and user also?

```bash
model User 
{
  id                String   @id @default(uuid())
  name              String?
  email             String   @unique
  image             String?
  role              UserRole @default(USER)
  password          String
  verificationToken String?
  isVerify          Boolean  @default(false)
  createdAt         DateTime @default(now())
  updatedAt         DateTime @default(now())

  problem Problem[]
}


model Problem
{
  Id String @id @default(uuid())
  title String
  description String
  difficulty Difficulty
  UserId String
  tag String[]
  examples Json
  contraints String
  hint String?
  editorial String?

  testcase Json
  codeSnippit Json
  referenceSolution Json

  created DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relationship
  user User @relation(fields:[UserId], references:[id], onDelete:Cascade)
}

```
When the database tables are generated from your Prisma schema:
✅ There will be a column named UserId in the Problem table.
❌ There will NOT be a separate column named user in the Problem table.

`UserId` → This is the actual column stored in the database (foreign key).
`user` → This is a virtual relation field used by Prisma in your application code. It's not a column in the database.

But, `the problem.user will give you the user object` — even though there's no user column — because Prisma joins it using the relation.
```bash
const problem = await prisma.problem.findFirst({
  include: {
    user: true // ← this works because of the virtual relation field
  }
})
```

✅ Best Practice:
Always define the relation field (user) unless you never plan to query the associated User directly from Problem — which is rare.


###### Q) Would there be a problem column created inside user table using above model?`
`No`, there will not be a problem column created in the User table.
It is a virtual field (not stored in the database). It tells Prisma: "This user can be associated with many problems". It does not result in a problem column in the database.


`So what if we don't write "problem Problem[]" in User model and just define the relationship in the problem table only-- will it still work?`
Yes, the relationship will still work correctly. Because Prisma only needs the @relation defined on one side to understand the link(we already do in Problem).

🧠 So why include `problem Problem[]` in User?
It lets you easily query all problems created by a user, like this:
```bash
const userWithProblems = await prisma.user.findUnique({
  where: { id: "some-user-id" },
  include: {
    problem: true, // 👈 Thanks to `problem Problem[]` field
  },
});

console.log(userWithProblems.problem); // List of problems created by the user

```
So, If you `don’t define problem Problem[]`, the Prisma Client won’t know that User has a related list of problems — even though the foreign key exists.

🧠 `Why does this work? i.e problem Problem[].`
Because problem Problem[] tells Prisma:
“This user can be associated with multiple Problem records.”
That’s why Prisma Client gives you access to that problem field for querying, filtering, including, etc.





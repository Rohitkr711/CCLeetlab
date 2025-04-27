# LEETCODE CLONE LEC-1

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






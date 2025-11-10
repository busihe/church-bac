# Church Backend

Node + Express + TypeScript backend using Prisma + PostgreSQL.

Quick start (Windows PowerShell):

1. Install dependencies
   npm install

2. Copy `.env.example` to `.env` and update `DATABASE_URL` and `JWT_SECRET`.

3. Generate Prisma client and run migrations:
   npx prisma generate
   npx prisma migrate dev --name init

4. Run in development:
   npm run dev

API:
- Auth: POST /api/auth/register, POST /api/auth/login
- Members: GET/POST/PUT/DELETE /api/members
- Pastors: GET/POST/PUT/DELETE /api/pastors
- Tithes: GET/POST/PUT/DELETE /api/tithes
- Contributions: GET/POST/PUT/DELETE /api/contributions
- Branches: GET/POST/PUT/DELETE /api/branches

Authorization:
- Use `Authorization: Bearer <token>` header.
- Role-based access is enforced (ADMIN, PASTOR, USER).

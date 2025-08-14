# Node TS Starter (Express + i18n + Cache + Mongo)

A ready-to-use Node.js + TypeScript API boilerplate with:
- Express, Helmet, CORS, Morgan
- i18n (i18next) with `en` and `ar` locales
- Validation (Joi) with translated error messages
- Optional MongoDB (Mongoose) and Redis cache
- Centralized error handler and status codes
- Winston logger integrated with Morgan
- Healthcheck route `/health`

## Quick Start

1) Copy environment file

```bash
cp .env.example .env
```

2) Dev (no DB/Redis)

```bash
npm install
npm run dev
# GET http://localhost:5000/health
```

3) Dev with local Mongo/Redis (optional)

- To enable Mongo, set `USE_DATABASE=true` and provide `MONGO_URI`.
- To enable Redis cache, set `USE_CACHE=true` and provide `REDIS_URL`.
- Then run `npm run dev` and hit `/health` to verify connectivity.

4) Build + Start (production-like)

```bash
npm run build
npm start
```

## Environment Variables
See `.env.example`:
- PORT=3000
- USE_DATABASE=false
- MONGO_URI=mongodb://localhost:27017/mydb
- USE_CACHE=false
- REDIS_URL=redis://localhost:6379
- CACHE_EXPIRATION_MINUTES=10

## Scripts
- dev: ts-node-dev on `index.ts`
- build: TypeScript compile + copy locales
- start: run compiled server from `dist/index.js`

## Structure
- `index.ts`: server entry, routes, healthcheck, graceful shutdown
- `src/config`: env-based config
- `src/middlewares`: i18n, cache, validation, error handler
- `src/modules/users`: example routes/service/model/validation
- `src/utils`: logger and status codes
- `src/locales`: i18n resources (en/ar)
- `src/cache/redis-client.ts`: shared Redis client (optional)

## Testing
- Jest + Supertest configured. Run:

```bash
npm test
```

## Notes
- To enable DB or cache, set `USE_DATABASE=true` / `USE_CACHE=true` and provide URIs.
- `/health` reports connectivity when DB/Redis are enabled.

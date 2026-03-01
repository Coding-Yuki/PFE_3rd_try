# Deployment Guide for PFE_3rd_try

## Overview
This project is a Next.js 16 school social network application with authentication, posts, comments, likes, and user profiles. It uses Prisma ORM with SQLite for local development.

## What's Been Fixed
✅ Removed static export (`output: 'export'`) - now supports dynamic routes and API endpoints
✅ Fixed basePath and assetPrefix configuration
✅ Config now ready for serverless deployment

## Deployment Options

### Option 1: Deploy to Vercel (Recommended)

**Step 1: Connect to Vercel**
1. Visit https://vercel.com and sign in or create an account
2. Click "Add New" → "Project"
3. Import your GitHub repository (Coding-Yuki/PFE_3rd_try)
4. Select the `main` branch

**Step 2: Configure Environment Variables**
In your Vercel project settings, add the following environment variables:

```
DATABASE_URL=<your-database-connection-string>
UPLOADTHING_TOKEN=<your-uploadthing-token>
UPLOADTHING_SECRET=<your-uploadthing-secret>
```

**Step 3: Set Up Database**
Since SQLite won't persist on serverless, you need to migrate to a cloud database:

Options:
- **PostgreSQL** (Recommended):
  - Use Vercel Postgres, Neon, or Railway
  - Update `prisma/schema.prisma` datasource provider to "postgresql"
  
- **Keep SQLite locally** (Development only):
  - SQLite works for local testing but won't work in production
  - Consider using Turso for serverless SQLite support

**Step 4: Deploy**
1. Click "Deploy"
2. Vercel will automatically:
   - Install dependencies
   - Run `npm run build`
   - Deploy to a live URL

### Option 2: Deploy to GitHub Pages (Static Export)

**Note**: This only works if you remove all API routes and dynamic features.

The existing GitHub Actions workflow at `.github/workflows/deploy.yml` is configured for GitHub Pages with static export, but **this conflicts** with your current API-based architecture.

You would need to:
1. Rebuild your app as a static site (remove all API routes)
2. Remove Prisma and database dependencies
3. Revert `next.config.ts` to use `output: 'export'`

**Not recommended** for this project - use Vercel instead.

### Option 3: Docker Deployment (Advanced)

Deploy to any platform supporting Docker (AWS, DigitalOcean, Railway, etc):

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and push:
```bash
docker build -t your-app .
docker push your-registry/your-app
```

---

## Database Setup Guide

### Switching from SQLite to PostgreSQL

1. **Update Prisma Schema**:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Create new migration**:
   ```bash
   npx prisma migrate dev --name migrate_to_postgres
   ```

3. **Set DATABASE_URL** in your `.env.local`:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```

### Database Providers

- **Vercel Postgres**: Easiest integration with Vercel
  - Create a Postgres database at https://vercel.com/docs/storage/vercel-postgres
  - Connection string is automatically provided

- **Neon**: Free tier available
  - Create project at https://neon.tech
  - Copy connection string to `.env`

- **Railway**: Simple deployment
  - Create PostgreSQL database at https://railway.app
  - Add DATABASE_URL to Vercel environment variables

## Pre-Deployment Checklist

- [ ] Fixed `next.config.ts` (removed static export) ✅
- [ ] Reviewed environment variables needed
- [ ] Set up cloud database (PostgreSQL recommended)
- [ ] Added database connection string to Vercel
- [ ] Configured UploadThing tokens (if file uploads needed)
- [ ] Tested build locally: `npm run build`
- [ ] All routes return proper responses

## Troubleshooting

**Build fails with "module not found"**
- Run `npm install` locally
- Check tsconfig.json paths are correct
- Verify all imports use correct relative paths

**Database connection errors**
- Check DATABASE_URL format
- Verify database is created
- Run migrations: `npx prisma migrate deploy`

**API routes returning 500 errors**
- Check server logs in Vercel dashboard
- Verify environment variables are set
- Test locally: `npm run dev`

**Upload functionality not working**
- Verify UPLOADTHING_TOKEN and UPLOADTHING_SECRET
- Check file types are allowed in uploadthing config
- Ensure disk space quota isn't exceeded

## Next Steps

1. **Local Testing**:
   ```bash
   npm install
   npm run build
   npm run start
   ```

2. **Connect to GitHub**:
   - Push changes to main branch
   - Vercel will automatically deploy on push

3. **Monitor Deployment**:
   - Watch build progress on Vercel dashboard
   - Check logs if deployment fails
   - Test live URL in browser

For questions, visit https://vercel.com/docs

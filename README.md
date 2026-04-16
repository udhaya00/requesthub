# Smart Request Hub

Smart Request Hub is a production-style MERN application for request intake, approval workflows, admin operations, AI-assisted drafting, exports, and chat-based help.

It now also includes a full DevOps deployment baseline for AWS:

- GitHub Actions CI
- GitHub Actions deployment workflows
- Terraform infrastructure for AWS
- Backend containerization for ECS Fargate
- Frontend static hosting through S3 and CloudFront
- ECS blue/green backend deployments with CodeDeploy

## Application Stack

- Frontend: React, Vite, Axios, Framer Motion
- Backend: Node.js, Express.js, JWT auth, bcrypt, Mongoose
- Database: MongoDB

## Repository Layout

```text
.
|-- client
|-- server
|-- infra/aws
|-- .github/workflows
`-- docs
```

## Core Product Features

- JWT-based signup and login
- Role-based access control
- Seeded admin account
- AI-style request analysis
- Request workflow engine with history
- Admin review and fulfillment controls
- Request export to CSV
- PDF preview simulation
- Chat-style assistant
- Responsive SaaS dashboard

## Default Admin

- Username: `udhaya`
- Password: `admin123`

## Local Development

### 1. Configure environment files

Create `server/.env` from [server/.env.example](C:/Users/buv36/Documents/New%20project/server/.env.example)

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/smart-request-hub
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=8h
CLIENT_URL=http://localhost:5173
```

Create `client/.env` from [client/.env.example](C:/Users/buv36/Documents/New%20project/client/.env.example)

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the app

Start MongoDB locally, then run:

```bash
npm start
```

Frontend:

```text
http://localhost:5173
```

## CI/CD and AWS Deployment

The AWS deployment baseline is documented in [docs/aws-cicd.md](C:/Users/buv36/Documents/New%20project/docs/aws-cicd.md).

### Included pipelines

- [CI workflow](C:/Users/buv36/Documents/New%20project/.github/workflows/ci.yml)
- [Terraform workflow](C:/Users/buv36/Documents/New%20project/.github/workflows/terraform-aws.yml)
- [Backend deploy workflow](C:/Users/buv36/Documents/New%20project/.github/workflows/deploy-backend.yml)
- [Frontend deploy workflow](C:/Users/buv36/Documents/New%20project/.github/workflows/deploy-frontend.yml)

### Included infrastructure

- [Terraform root](C:/Users/buv36/Documents/New%20project/infra/aws)
- [Backend Docker image](C:/Users/buv36/Documents/New%20project/server/Dockerfile)

### AWS target architecture

- Frontend: S3 + CloudFront
- Backend: ECS Fargate + ALB + CodeDeploy blue/green
- Image registry: ECR
- Logs: CloudWatch Logs
- CI/CD auth: GitHub Actions OIDC role
- Database: MongoDB Atlas or another MongoDB endpoint reachable from AWS
- Edge routing: CloudFront serves the SPA and proxies `/api/*` to the ALB

## Verification

- `npm install` completed successfully
- `npm run build` completed successfully
- Backend module import check completed successfully

## Notes

- Terraform is configured to use an S3 backend, and the remote state bucket must be created before first apply.
- The Terraform workflow is designed so infrastructure changes can be validated in CI and applied manually through GitHub Actions using the current S3 lockfile approach.

# TP-NoSQL

Deploy docker environment

```bash
# Build app docker image
npm run docker:build

# Create database and push the schema
npm run docker:prepare

# Run app
npm run docker:run

# Run databases only
npm run docker:run:databases

# Stop and remove all containers, networks and volumes
npm run docker:clean
```
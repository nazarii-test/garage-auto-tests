# Base image
FROM mcr.microsoft.com/playwright:v1.64.1-noble

# Set the working directory
WORKDIR /playwright-test

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy project files
COPY . .

# Run tests
CMD ["npx", "playwright", "test", "--project=e2e"]

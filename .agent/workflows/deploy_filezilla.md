---
description: How to deploy this Next.js app to a VPS using FileZilla
---

# Deploying Nicopedia via FileZilla

This guide assumes you are deploying to a server (VPS like AWS EC2, DigitalOcean, Hetzner) where you have Node.js installed.

> **Note**: This app uses Dynamic Rendering (Search Params), so it cannot be deployed to standard static hosting (like basic GoDaddy shared hosting) without a Node.js server.

## 1. Build the App
Run this locally in your terminal:
```bash
npm run build
```

## 2. Prepare Files for Transfer
Next.js `output: 'standalone'` creates a streamlined folder.

1.  Locate `.next/standalone`.
2.  **Copy** the `public` folder from your root directory INTO `.next/standalone/public`.
3.  **Copy** the `.next/static` folder from your build INTO `.next/standalone/.next/static`.

Your upload package is the contents of `.next/standalone`.

## 3. Upload with FileZilla
1.  Connect to your server.
2.  Navigate to your web folder (e.g., `/var/www/nicopedia` or `/home/user/nicopedia`).
3.  Drag everything **inside** the `.next/standalone` folder to the server.

Structure on server should look like:
- `public/`
- `.next/`
- `server.js`
- `package.json`

## 4. Run the Server
SSH into your server and run:
```bash
# Install (minimal, usually standard dependencies are bundled but sometimes sharp/next need checking)
# Actually, standalone bundles almost everything!

# Start the server (default port 3000)
node server.js
```
Recommend using `pm2` to keep it alive:
```bash
npm install -g pm2
pm2 start server.js --name nicopedia
```

## Troubleshooting
-   **Images not loading?** Ensure you copied `.next/static` to `.next/standalone/.next/static`. This is a common mistake.
-   **Port 3000 in use?** `PORT=8080 node server.js`

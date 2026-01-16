---
description: How to deploy this Next.js app to Vercel
---

# Deploying Nicopedia to Vercel

Vercel is the easiest place to host Next.js apps because they built the framework.

## 1. Push to GitHub
Make sure your latest code is pushed to a GitHub repository.
```bash
git add .
git commit -m "Ready for deploy"
git push
```

## 2. Connect Vercel
1.  Go to [Vercel.com](https://vercel.com) and log in.
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `Overdesigned-Wikipedia-S3` repository.
4.  **Framework Preset**: It should auto-detect "Next.js".
5.  **Environment Variables**: You likely don't have any secret keys for this app yet (Wikipedia API is public), so you can skip this.
6.  Click **Deploy**.

## 3. Done
Vercel will detect the build settings automatically.
-   It handles the "Node.js" server part for you (Serverless Functions).
-   It handles the Static Assets.
-   It gives you a free `.vercel.app` domain.

## Verified
-   The app is configured correctly for Vercel (Standard Output).
-   SVG support is enabled for Fandom logos.

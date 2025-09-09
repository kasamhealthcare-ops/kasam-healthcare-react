# Kasam Healthcare Frontend - Vercel Deployment Guide

## 🚀 Quick Deployment Steps

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI globally:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from the React app directory:**
   ```bash
   cd kasam-healthcare-react
   vercel --prod
   ```

4. **Follow the prompts:**
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N** (for first deployment)
   - Project name: `kasam-healthcare-frontend`
   - Directory: `./` (current directory)

### Method 2: Vercel Dashboard (Web Interface)

1. **Go to [vercel.com](https://vercel.com) and sign in**

2. **Click "New Project"**

3. **Import your Git repository:**
   - Connect your GitHub/GitLab account
   - Select the `kasam-health-care` repository
   - Choose the `kasam-healthcare-react` folder as root directory

4. **Configure deployment settings:**
   - **Framework Preset:** Vite
   - **Root Directory:** `kasam-healthcare-react`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Environment Variables:**
   Add these in the Vercel dashboard:
   ```
   VITE_API_URL=https://kasam-healthcare-backend-exc1.vercel.app/api
   VITE_API_TIMEOUT=15000
   VITE_DEBUG_MODE=false
   VITE_NODE_ENV=production
   ```

6. **Click "Deploy"**

## 🔧 Configuration Details

### Vercel Configuration (`vercel.json`)
- ✅ Already created and configured
- ✅ Static asset caching enabled
- ✅ SPA routing configured
- ✅ Environment variables set

### Build Optimization
- ✅ Terser minification enabled
- ✅ Code splitting configured
- ✅ Vendor chunks separated
- ✅ Gzip compression ready

## 🌐 Custom Domain Setup

1. **In Vercel Dashboard:**
   - Go to your project settings
   - Click "Domains"
   - Add your custom domain
   - Follow DNS configuration instructions

2. **DNS Configuration:**
   - Add CNAME record pointing to your Vercel deployment
   - Or add A record with Vercel's IP addresses

## 🔍 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] API calls work (check Network tab)
- [ ] Authentication flow works
- [ ] All routes accessible
- [ ] Mobile responsiveness
- [ ] Performance metrics good

## 🚨 Troubleshooting

### Build Fails
- Check Node.js version (use Node 18+)
- Verify all dependencies installed
- Check for TypeScript errors

### API Connection Issues
- Verify VITE_API_URL is correct
- Check CORS settings on backend
- Verify backend is deployed and running

### Routing Issues
- Ensure vercel.json has SPA routing config
- Check React Router configuration

## 📊 Expected Performance
- **Build Time:** ~6-8 seconds
- **Bundle Size:** ~335KB (92KB gzipped)
- **CSS Size:** ~272KB (40KB gzipped)
- **Lighthouse Score:** 90+ expected

## 🔗 Useful Links
- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [React Router with Vercel](https://vercel.com/guides/deploying-react-with-vercel)

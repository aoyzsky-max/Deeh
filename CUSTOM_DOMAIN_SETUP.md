# Custom Domain Setup Guide for Vercel

## Overview

This guide will help you connect your domain from "Cheap Buy" (or any domain registrar) to your Vercel deployment.

---

## Step 1: Deploy Your App to Vercel First

Before connecting your domain, you need to deploy your app:

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy (see `VERCEL_DEPLOYMENT.md` for details)

3. **Note your Vercel URL**
   - After deployment, you'll get a URL like: `cosmovid.vercel.app`
   - Keep this for reference

---

## Step 2: Add Domain in Vercel

### 2.1 Access Domain Settings

1. Go to your Vercel dashboard
2. Click on your project
3. Go to **"Settings"** tab
4. Click **"Domains"** in the left sidebar

### 2.2 Add Your Domain

1. In the **"Domains"** section, enter your domain:
   - For root domain: `yourdomain.com`
   - For subdomain: `www.yourdomain.com` or `app.yourdomain.com`
2. Click **"Add"** or **"Add Domain"**

### 2.3 Vercel Will Show DNS Configuration

Vercel will display DNS records you need to add. You'll see something like:

**For Root Domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW Subdomain (www.yourdomain.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**OR Vercel might provide:**
```
Type: A
Name: @
Value: 76.76.21.21

Type: A
Name: @
Value: 76.76.21.22
```

---

## Step 3: Configure DNS at Your Domain Registrar

### 3.1 Log into Your Domain Registrar

1. Go to your domain registrar's website (where you bought the domain)
2. Log into your account
3. Find **"DNS Management"** or **"Domain Settings"**

### 3.2 Common Registrars

**If you used "Cheap Buy" or similar:**
- Look for: **"DNS Settings"**, **"DNS Management"**, **"Name Servers"**, or **"Domain Settings"**
- Common locations:
  - Dashboard → My Domains → [Your Domain] → DNS Settings
  - Domain Management → DNS Records
  - Advanced Settings → DNS

### 3.3 Add DNS Records

You need to add the DNS records that Vercel provided:

#### Option A: Using A Records (Root Domain)

1. Find **"A Record"** or **"Add Record"**
2. Add these records:

```
Type: A
Host/Name: @ (or leave blank, or enter "yourdomain.com")
Value/Points to: 76.76.21.21
TTL: 3600 (or Auto)

Type: A
Host/Name: @ (or leave blank)
Value/Points to: 76.76.21.22
TTL: 3600 (or Auto)
```

#### Option B: Using CNAME (WWW Subdomain)

1. Add CNAME record:

```
Type: CNAME
Host/Name: www
Value/Points to: cname.vercel-dns.com
TTL: 3600 (or Auto)
```

#### Option C: Using Vercel's Name Servers (Easiest)

Instead of A/CNAME records, you can use Vercel's name servers:

1. In Vercel, go to **Settings → Domains**
2. Click on your domain
3. Look for **"Use Vercel DNS"** or **"Name Servers"**
4. Copy the name servers (usually 2-4 servers like):
   - `ns1.vercel-dns.com`
   - `ns2.vercel-dns.com`

5. At your domain registrar:
   - Find **"Name Servers"** or **"DNS Servers"** section
   - Change from default to **"Custom"** or **"Use Custom Name Servers"**
   - Enter the Vercel name servers
   - Save

**This method is easier and Vercel manages everything automatically!**

---

## Step 4: Wait for DNS Propagation

### 4.1 Propagation Time

- DNS changes can take **5 minutes to 48 hours** to propagate
- Usually takes **15-60 minutes**
- Vercel will show status: **"Valid Configuration"** when ready

### 4.2 Check Status in Vercel

1. Go to **Settings → Domains** in Vercel
2. Check your domain status:
   - ⏳ **"Pending"** = DNS not yet propagated
   - ✅ **"Valid Configuration"** = Ready!
   - ❌ **"Invalid Configuration"** = Check DNS settings

### 4.3 Verify DNS Propagation

You can check if DNS has propagated:

**Online Tools:**
- [whatsmydns.net](https://www.whatsmydns.net)
- [dnschecker.org](https://dnschecker.org)

Enter your domain and check if it points to Vercel's IPs.

---

## Step 5: SSL Certificate (Automatic)

### 5.1 Vercel Handles SSL Automatically

- Once DNS is configured correctly, Vercel automatically:
  - Issues SSL certificate (Let's Encrypt)
  - Enables HTTPS
  - Usually takes 5-10 minutes after DNS propagation

### 5.2 Verify SSL

1. Visit `https://yourdomain.com`
2. Check for padlock icon in browser
3. Should show **"Secure"** connection

---

## Step 6: Test Your Domain

### 6.1 Visit Your Domain

1. Open browser
2. Go to `https://yourdomain.com`
3. Your app should load!

### 6.2 Test Both Versions

- `https://yourdomain.com` (root)
- `https://www.yourdomain.com` (if configured)

Both should work and redirect properly.

---

## Troubleshooting

### Domain Shows "Invalid Configuration"

**Problem**: DNS records not set correctly

**Solution**:
1. Double-check DNS records match Vercel's requirements exactly
2. Ensure TTL is set (3600 or Auto)
3. Wait 15-30 minutes for propagation
4. Use Vercel's name servers method (easier)

### Domain Takes Too Long to Propagate

**Problem**: DNS changes not showing

**Solution**:
1. Clear DNS cache: `sudo dscacheutil -flushcache` (Mac) or restart router
2. Try different DNS server: Use Google DNS (8.8.8.8) or Cloudflare (1.1.1.1)
3. Contact your registrar if > 24 hours

### SSL Certificate Not Issuing

**Problem**: HTTPS not working

**Solution**:
1. Ensure DNS is fully propagated
2. Wait 10-15 minutes after DNS is valid
3. Check Vercel dashboard for SSL status
4. Try accessing `https://` explicitly

### Domain Points to Wrong Place

**Problem**: Domain shows registrar's default page

**Solution**:
1. Verify DNS records are correct
2. Check if you're using name servers (should use Vercel's)
3. Remove any conflicting DNS records
4. Wait for propagation

### "Domain Already in Use" Error

**Problem**: Domain already connected to another Vercel project

**Solution**:
1. Check other projects in your Vercel account
2. Remove domain from old project first
3. Then add to new project

---

## Common Domain Registrar Instructions

### Namecheap

1. Log in → **Domain List** → Click **"Manage"**
2. Go to **"Advanced DNS"** tab
3. Add A records or change **"Name Servers"** to Custom
4. Enter Vercel name servers

### GoDaddy

1. Log in → **My Products** → **DNS**
2. Click **"Manage DNS"**
3. Add A/CNAME records or change **"Name Servers"**

### Google Domains

1. Log in → Select domain → **DNS**
2. Scroll to **"Name Servers"**
3. Change to **"Use Custom Name Servers"**
4. Enter Vercel name servers

### Cloudflare

1. Log in → Select domain
2. Go to **"DNS"** → **"Records"**
3. Add A/CNAME records
4. Or change **"Name Servers"** if using Cloudflare's proxy

### Generic Instructions

Look for:
- **DNS Management**
- **DNS Settings**
- **Name Servers**
- **Domain Settings** → **DNS**

---

## Best Practices

### ✅ Recommended Setup

1. **Use Vercel Name Servers** (easiest method)
2. **Enable both root and www**:
   - Add `yourdomain.com`
   - Add `www.yourdomain.com`
   - Vercel handles redirects automatically

### ✅ Security

- Vercel automatically provides SSL/HTTPS
- No additional configuration needed
- Always use HTTPS

### ✅ Performance

- Vercel's CDN automatically optimizes your site
- Global edge network for fast loading
- No additional setup needed

---

## Quick Reference

### Vercel Name Servers (if using this method)
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### Vercel A Records (if using A records)
```
76.76.21.21
76.76.21.22
```

### Vercel CNAME (for www)
```
cname.vercel-dns.com
```

---

## Summary Checklist

- [ ] App deployed to Vercel
- [ ] Domain added in Vercel dashboard
- [ ] DNS records configured at registrar (or name servers changed)
- [ ] Waited for DNS propagation (15-60 min)
- [ ] Domain shows "Valid Configuration" in Vercel
- [ ] SSL certificate issued (automatic)
- [ ] Tested `https://yourdomain.com`
- [ ] Both root and www work (if configured)

---

## Need Help?

If you're stuck:
1. Check Vercel's domain status in dashboard
2. Verify DNS records match exactly
3. Wait longer for propagation
4. Contact your domain registrar support
5. Check Vercel's documentation: [vercel.com/docs/concepts/projects/domains](https://vercel.com/docs/concepts/projects/domains)

---

## ⚠️ Reminder About yt-dlp

Your app will deploy successfully and your domain will work, but remember:
- **Video download functionality will NOT work** on Vercel
- This is due to serverless limitations (can't run yt-dlp binary)
- Consider Railway, Render, or Fly.io for full functionality

The domain and frontend will work perfectly, but API routes will fail.


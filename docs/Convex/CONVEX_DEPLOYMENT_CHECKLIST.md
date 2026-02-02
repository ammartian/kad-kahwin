# Convex Deployment Checklist

Complete the following to activate your waitlist:

## ✅ Pre-Deployment (Completed)
- [x] Convex package installed
- [x] Database schema created (`/convex/schema.ts`)
- [x] Convex functions created (`/convex/waitlist.ts`)
- [x] React components integrated
- [x] Environment variables configured
- [x] TypeScript setup configured

## 🚀 Deployment Steps (You need to do this)

### Step 1: Sign Up for Convex
- [ ] Go to https://dashboard.convex.dev
- [ ] Create account with GitHub, Google, or email
- [ ] Create a new project

### Step 2: Deploy Your Backend
```bash
cd /Users/ammarhakimi/kad-kahwin
bunx convex deploy
```
- [ ] Log in when prompted
- [ ] Confirm deployment
- [ ] Note your Convex URL (format: `https://<deployment-id>.convex.cloud`)

### Step 3: Update .env.local
Replace the placeholder with your actual URL:
```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-id.convex.cloud
```
- [ ] Update `.env.local` with your Convex URL
- [ ] Save the file

### Step 4: Restart Dev Server
```bash
bun run dev
```
- [ ] Stop the dev server (Ctrl+C)
- [ ] Start it again with `bun run dev`
- [ ] Verify no errors in terminal

### Step 5: Test the Waitlist
- [ ] Open http://localhost:3000
- [ ] Scroll to Hero section
- [ ] Click "Sertai Senarai Tunggu" or main CTA button
- [ ] Waitlist modal should appear
- [ ] Enter a test email (e.g., test@example.com)
- [ ] Click submit button
- [ ] Should see success message ✅
- [ ] Check the Social Proof section - count should update

### Step 6: Verify in Convex Dashboard
- [ ] Go to https://dashboard.convex.dev
- [ ] Select your project
- [ ] Go to "Data" tab
- [ ] Check "waitlist" table
- [ ] You should see your test email entry

## 🧪 Test Cases

### Test 1: Add Email
- [ ] Submit valid email → Success message shown ✅
- [ ] Modal closes after success
- [ ] Email appears in Convex dashboard

### Test 2: Duplicate Email
- [ ] Try submitting same email again
- [ ] Should show error: "Email already subscribed to waitlist"
- [ ] No duplicate entry in database

### Test 3: Invalid Email
- [ ] Try submitting invalid email (e.g., "notanemail")
- [ ] Should show client-side validation error
- [ ] Form prevents submission

### Test 4: Real-Time Count
- [ ] Open app in two browser tabs
- [ ] In Tab 1: Submit new email
- [ ] In Tab 2: Check if count increased automatically
- [ ] If not immediate, refresh Tab 2 - should show new count

### Test 5: Mobile Responsiveness
- [ ] Open on mobile device or use DevTools mobile emulation
- [ ] Modal should be responsive
- [ ] Form fields should be tappable (48px+ height)
- [ ] Success animation should work smoothly

## 📱 Production Deployment

When ready to deploy to production:

```bash
# Build and test locally
bun run build

# Deploy to Vercel (requires Vercel account)
vercel
```

### Before Production:
- [ ] Test all waitlist flows thoroughly
- [ ] Update Convex URL in Vercel environment variables
- [ ] Verify HTTPS is enabled
- [ ] Set up proper error monitoring (Sentry)
- [ ] Test on real mobile devices
- [ ] Monitor initial traffic via PostHog
- [ ] Check Convex dashboard for database health

## 🎯 Success Criteria

Your Convex setup is complete when:
- ✅ Email validation works
- ✅ Waitlist count increments with new submissions
- ✅ Duplicate emails are prevented
- ✅ Real-time updates work across browser tabs
- ✅ Error messages are user-friendly
- ✅ No console errors in browser
- ✅ PostHog events track properly
- ✅ Mobile experience is smooth

## 📞 Need Help?

If something doesn't work:

1. **Check error messages in browser console** (F12 → Console)
2. **Verify .env.local has correct CONVEX_URL**
3. **Confirm `bunx convex deploy` completed successfully**
4. **Check Convex dashboard for any deployment issues**
5. **Review CONVEX_SETUP.md in this repo for detailed instructions**

---

**Last Updated:** February 3, 2026
**Implementation Status:** Ready for Deployment ✨

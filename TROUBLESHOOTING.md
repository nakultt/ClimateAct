# 🔧 TROUBLESHOOTING GUIDE

## Quick Fixes for Common Issues

---

## 🚨 Build/Compilation Errors

### Error: "Module not found: Can't resolve '@/lib/...'"

**Cause:** TypeScript path alias not working
**Fix:**

```bash
# Restart TypeScript server in VS Code
# Press Ctrl+Shift+P → "TypeScript: Restart TS Server"

# Or rebuild
npm run build
```

### Error: "Type error: Cannot find module"

**Cause:** Missing type definitions
**Fix:**

```bash
npm install --save-dev @types/node @types/react @types/react-dom @types/leaflet
```

### Error: "Failed to compile - TailwindCSS"

**Cause:** TailwindCSS v4 syntax issues
**Fix:** Check `tailwind.config.js` and use correct v4 syntax

```javascript
// Use bg-linear instead of bg-gradient
className = "bg-linear-to-r from-blue-500 to-green-500";
```

---

## 🌐 API Errors

### Error: "Gemini API Error: 400"

**Cause:** Invalid API key or rate limit
**Fix:**

1. Check `.env.local` file exists
2. Verify API key is correct
3. Check Gemini API dashboard for quota

```bash
# Verify env file
cat .env.local

# Should show:
# GEMINI_API_KEY=AIzaSyAMyHq9kAJRxqvgnKpteQm0YE7BG4oXA8s
```

### Error: "Climate API timeout"

**Cause:** Open-Meteo API is slow (30-60 sec)
**Fix:**

- Wait longer (it's fetching 100 years of data)
- Show loading indicator (already implemented)
- Consider caching responses

### Error: "Geocode API 403 Forbidden"

**Cause:** Nominatim requires User-Agent header
**Fix:** Already handled in code:

```typescript
headers: {
  'User-Agent': 'ClimateCommApp/1.0',
}
```

---

## 🔊 Voice/TTS Issues

### Issue: "Voice not playing"

**Possible Causes:**

1. Browser doesn't support Web Speech API
2. Language not supported by browser
3. HTTPS required (works on localhost)

**Fix:**

```javascript
// Test TTS support
if ("speechSynthesis" in window) {
  console.log("TTS supported");
  console.log(window.speechSynthesis.getVoices());
} else {
  console.log("TTS not supported");
}
```

**Browser Support:**

- ✅ Chrome (best)
- ✅ Edge (good)
- ⚠️ Firefox (limited)
- ⚠️ Safari (limited)

### Issue: "Voice plays in English for Tamil/Hindi"

**Cause:** Browser doesn't have that language voice
**Fix:**

- Use Chrome (best multilingual support)
- Install language packs in OS
- Fallback to English voice (already handled)

---

## 📍 Location Issues

### Issue: "Location detection failed"

**Causes:**

1. User denied permission
2. HTTPS required (works on localhost)
3. Browser doesn't support geolocation

**Fix:**

```typescript
// Check if geolocation is supported
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => console.log(position),
    (error) => console.error(error)
  );
} else {
  console.log("Geolocation not supported");
}
```

**Workaround:** Use manual search or demo cities

---

## 💾 Storage Issues

### Issue: "Settings not persisting"

**Cause:** localStorage not available
**Fix:** Check browser settings (incognito mode may block)

```typescript
// Test localStorage
try {
  localStorage.setItem("test", "value");
  localStorage.removeItem("test");
  console.log("localStorage works");
} catch (e) {
  console.error("localStorage blocked");
}
```

---

## 🎨 UI/Display Issues

### Issue: "Components not showing"

**Cause:** State not updating
**Fix:** Check React DevTools

```bash
# Install React DevTools extension
# Chrome: https://chrome.google.com/webstore (search "React Developer Tools")
```

### Issue: "Styles not applying"

**Cause:** TailwindCSS not compiling
**Fix:**

```bash
# Restart dev server
npm run dev
```

### Issue: "Layout broken on mobile"

**Cause:** Missing responsive classes
**Fix:** Check component uses mobile-first classes:

```typescript
className = "grid grid-cols-1 lg:grid-cols-2";
// Not: grid-cols-2 lg:grid-cols-1
```

---

## 🔒 Environment Variable Issues

### Issue: "API key undefined"

**Cause:** `.env.local` not loaded
**Fix:**

1. Check file name is EXACTLY `.env.local` (not `.env`)
2. Restart dev server after adding env vars
3. Don't add quotes around values

```env
# ✅ Correct
GEMINI_API_KEY=AIzaSyAMyHq9kAJRxqvgnKpteQm0YE7BG4oXA8s

# ❌ Wrong
GEMINI_API_KEY="AIzaSyAMyHq9kAJRxqvgnKpteQm0YE7BG4oXA8s"
```

### Issue: "env var undefined in browser"

**Cause:** Need `NEXT_PUBLIC_` prefix for client-side
**Fix:**

```env
# Server-side only
GEMINI_API_KEY=xxx

# Client-side accessible
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 🚀 Deployment Issues (Vercel)

### Issue: "Build failed on Vercel"

**Cause:** Different Node version or missing env vars
**Fix:**

1. Add `GEMINI_API_KEY` in Vercel dashboard
2. Check Node version in `package.json`:

```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### Issue: "API routes return 500"

**Cause:** Missing environment variables
**Fix:** Vercel → Settings → Environment Variables → Add all vars

### Issue: "Deployment succeeds but app doesn't work"

**Cause:** Client-side routing issue
**Fix:** Check `next.config.ts`:

```typescript
const nextConfig = {
  // Add this if needed
  async redirects() {
    return [];
  },
};
```

---

## 🐛 Runtime Errors

### Error: "Cannot read property of undefined"

**Cause:** Data not loaded before rendering
**Fix:** Add conditional rendering:

```typescript
{
  climateData ? <ClimateCard data={climateData} /> : <div>Loading...</div>;
}
```

### Error: "hydration failed"

**Cause:** Server/client mismatch
**Fix:** Add `'use client'` directive to components using browser APIs:

```typescript
"use client";
import { useState } from "react";
```

### Error: "Window is not defined"

**Cause:** Using browser API in server component
**Fix:** Check for window before using:

```typescript
if (typeof window !== "undefined") {
  // Use window API
}
```

---

## 📱 Mobile Issues

### Issue: "Touch events not working"

**Cause:** Need touch event listeners
**Fix:** Use onClick (handles both mouse and touch)

```typescript
<button onClick={handleClick}>Click me</button>
// Not: onMouseDown
```

### Issue: "Zoom disabled"

**Cause:** Viewport meta tag
**Fix:** Check `app/layout.tsx`:

```typescript
<meta name="viewport" content="width=device-width, initial-scale=1" />
// Not: maximum-scale=1
```

---

## 🔄 State Management Issues

### Issue: "State not updating"

**Cause:** Mutating state directly
**Fix:** Use setter function:

```typescript
// ❌ Wrong
data.value = "new";
setData(data);

// ✅ Correct
setData({ ...data, value: "new" });
```

### Issue: "Infinite re-render"

**Cause:** setState in render
**Fix:** Move to useEffect or event handler:

```typescript
// ❌ Wrong
setCount(count + 1); // In render

// ✅ Correct
useEffect(() => {
  setCount(count + 1);
}, [dependency]);
```

---

## 🎬 Demo Day Issues

### Issue: "Slow internet during demo"

**Cause:** Large API responses
**Fix:**

1. Pre-load demo locations
2. Add mock data fallback
3. Show loading indicators

### Issue: "API rate limit during demo"

**Cause:** Too many requests
**Fix:**

- Use demo cities (already cached)
- Don't spam API calls
- Have backup slides

### Issue: "Voice not working on projector"

**Cause:** Audio output to wrong device
**Fix:**

- Test audio before demo
- Bring headphones as backup
- Have video recording ready

---

## 🛠️ Development Tools

### VS Code Extensions (Recommended):

- ESLint
- Prettier
- TailwindCSS IntelliSense
- TypeScript and JavaScript Language Features

### Browser DevTools:

```
F12 → Console → Check for errors
F12 → Network → Check API calls
F12 → Application → Check localStorage
```

### React DevTools:

```
Install extension
F12 → React → Check component state
```

---

## 📞 Emergency Contacts

### During Hackathon:

- Check FILES.md for file reference
- Check PRESENTATION.md for demo help
- Check DEPLOYMENT.md for Vercel issues

### API Status:

- Gemini: https://status.google.dev
- Open-Meteo: https://open-meteo.com
- Vercel: https://www.vercel-status.com

---

## 🔍 Debugging Checklist

When something breaks:

1. **Check Console** → F12 → Console → Look for errors
2. **Check Network** → F12 → Network → Check API responses
3. **Check State** → React DevTools → Check component state
4. **Check Env** → Verify `.env.local` exists and has correct values
5. **Check Build** → Run `npm run build` → Fix TypeScript errors
6. **Restart Server** → Stop and run `npm run dev` again
7. **Clear Cache** → Ctrl+Shift+R (hard reload)
8. **Check Git** → `git status` → Verify files are saved

---

## 🆘 Last Resort

### Nuclear Option:

```bash
# Delete everything and start fresh
rm -rf node_modules
rm -rf .next
npm install
npm run dev
```

### Still broken?

```bash
# Check Node version
node --version
# Should be 18.x or higher

# Update npm
npm install -g npm@latest

# Clear npm cache
npm cache clean --force
```

---

## ✅ Pre-Demo Checklist

Run this 30 minutes before demo:

```bash
# 1. Test build
npm run build

# 2. Test all pages
# - http://localhost:3000 (onboarding)
# - http://localhost:3000/dashboard

# 3. Test APIs
# - Select Chennai
# - Click "Get Climate Data"
# - Verify explanation shows
# - Test voice playback

# 4. Test mobile
# - Open dev tools → Toggle device toolbar
# - Test on iPhone and Android views

# 5. Prepare backup
# - Take screenshots of working app
# - Have presentation slides ready
# - Test internet connection
```

---

## 🎯 Success Criteria

Your app is working if:

- ✅ Onboarding page loads
- ✅ Can select language and literacy
- ✅ Dashboard loads after onboarding
- ✅ Can detect or search location
- ✅ Climate API returns data (may take 30-60 sec)
- ✅ Gemini explanation shows
- ✅ Actions list displays
- ✅ Voice playback works (at least in Chrome)
- ✅ No console errors (warnings are okay)

---

**🎉 If all checks pass → You're ready for the hackathon! Good luck! 🚀**

---

_Last Updated: October 21, 2025_
_For urgent issues during hackathon, check console first!_

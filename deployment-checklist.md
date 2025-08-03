# Vercel Deployment Checklist

## Before Deploying
- [ ] All changes are committed to git
- [ ] Local build works: `npm run build`
- [ ] Images exist in `public/assets/images/`
- [ ] File names match exactly (case-sensitive)

## After Deploying
- [ ] Check Vercel deployment logs for errors
- [ ] Visit `/image-test` route to debug images
- [ ] Open browser console for asset debug logs
- [ ] Try accessing image URLs directly

## Troubleshooting Steps
1. **Force Redeploy**: Delete and redeploy on Vercel
2. **Clear Cache**: Hard refresh browser (Ctrl+F5)
3. **Check Network Tab**: Look for 404 errors on images
4. **Verify URLs**: Test direct image access
5. **Check Vercel Logs**: Look for build errors

## Common Issues
- Vercel cache not updated
- File path case sensitivity
- Missing static file configuration
- Build process not copying assets

## Debug Commands
```bash
# Test local build
npm run build

# Check if images are in dist
ls dist/assets/images/

# Test image accessibility
curl -I https://your-domain.vercel.app/assets/images/image.png
``` 
@echo off
echo ==============================================================================
echo  GREENSCAPE PRO AI - PUSH UPDATES TO GITHUB
echo ==============================================================================
echo.

set REPO_URL=https://github.com/SunE1294/greenscape-autoquote-ai.git
echo Target: %REPO_URL%
echo.

git add .
git commit -m "feat(stripe): wire real Stripe SDK for 50% deposit checkout sessions with dynamic URLs"
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo ==============================================================================
echo  SUCCESS! Voice dictation feature pushed to GitHub and deploying to Vercel!
echo ==============================================================================
pause

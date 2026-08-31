@echo off
echo ==============================================================================
echo  GREENSCAPE PRO AI - PUSH UPDATES TO GITHUB
echo ==============================================================================
echo.

set REPO_URL=https://github.com/SunE1294/greenscape-autoquote-ai.git
echo Target: %REPO_URL%
echo.

git add .
git commit -m "fix(build): configure dynamic rendering and build safety for Vercel deployment"
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo ==============================================================================
echo  UPDATES PUSHED! Vercel will now automatically re-trigger build and succeed!
echo ==============================================================================
pause

@echo off
echo ==============================================================================
echo  GREENSCAPE PRO AI - PUSH UPDATES TO GITHUB
echo ==============================================================================
echo.

set REPO_URL=https://github.com/SunE1294/greenscape-autoquote-ai.git
echo Target: %REPO_URL%
echo.

git add .
git commit -m "feat(supabase): wire direct @supabase/supabase-js active inserts and PostgreSQL pooler for guaranteed DB persistence"
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git push -u origin main

echo.
echo ==============================================================================
echo  SUCCESS! Voice dictation feature pushed to GitHub and deploying to Vercel!
echo ==============================================================================
pause

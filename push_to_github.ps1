# ==============================================================================
# GREENSCAPE PRO AI - PUSH UPDATES TO GITHUB (PowerShell)
# ==============================================================================

$RepoUrl = "https://github.com/SunE1294/greenscape-autoquote-ai.git"
Write-Host "Target Repository: $RepoUrl" -ForegroundColor Cyan

git add .
git commit -m "fix(build): configure dynamic rendering and build safety for Vercel deployment"
git remote remove origin 2>$null
git remote add origin $RepoUrl
git push -u origin main

Write-Host "`n🎉 UPDATES PUSHED! Vercel will now automatically re-trigger build and succeed!" -ForegroundColor Green

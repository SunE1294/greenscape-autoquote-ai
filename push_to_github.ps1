# ==============================================================================
# GREENSCAPE PRO AI - PUSH UPDATES TO GITHUB (PowerShell)
# ==============================================================================

$RepoUrl = "https://github.com/SunE1294/greenscape-autoquote-ai.git"
Write-Host "Target Repository: $RepoUrl" -ForegroundColor Cyan

git add .
git commit -m "feat(stripe): wire real Stripe SDK for 50% deposit checkout sessions with dynamic URLs"
git remote remove origin 2>$null
git remote add origin $RepoUrl
git push -u origin main

Write-Host "`n🎉 SUCCESS! Voice dictation feature pushed to GitHub and deploying to Vercel!" -ForegroundColor Green

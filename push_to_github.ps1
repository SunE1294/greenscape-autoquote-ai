# ==============================================================================
# GREENSCAPE PRO AI - PUSH UPDATES TO GITHUB (PowerShell)
# ==============================================================================

$RepoUrl = "https://github.com/SunE1294/greenscape-autoquote-ai.git"
Write-Host "Target Repository: $RepoUrl" -ForegroundColor Cyan

git add .
git commit -m "fix(modal): close unclosed tags for Twilio SMS label in ProposalDispatchModal"
git remote remove origin 2>$null
git remote add origin $RepoUrl
git push -u origin main

Write-Host "`n🎉 SUCCESS! Voice dictation feature pushed to GitHub and deploying to Vercel!" -ForegroundColor Green

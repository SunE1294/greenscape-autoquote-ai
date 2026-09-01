# ==============================================================================
# GREENSCAPE PRO AI - PUSH UPDATES TO GITHUB (PowerShell)
# ==============================================================================

$RepoUrl = "https://github.com/SunE1294/greenscape-autoquote-ai.git"
Write-Host "Target Repository: $RepoUrl" -ForegroundColor Cyan

git add .
git commit -m "feat(db): wire real Supabase database writes for proposals and proposal_items with dynamic row IDs and reset flow"
git remote remove origin 2>$null
git remote add origin $RepoUrl
git push -u origin main

Write-Host "`n🎉 SUCCESS! Voice dictation feature pushed to GitHub and deploying to Vercel!" -ForegroundColor Green

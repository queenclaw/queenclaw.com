# List all directories in [lang] folder
$langPath = "src/app/[lang]"
if (Test-Path $langPath) {
    Get-ChildItem -Path $langPath -Directory | ForEach-Object { Write-Output $_.Name }
} else {
    Write-Output "Path not found: $langPath"
}
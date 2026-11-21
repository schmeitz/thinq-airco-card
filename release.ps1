# Nieuwe versie uitbrengen van de ThinQ Airco Card.
# Gebruik:  .\release.ps1 1.2.1 "Luchtstroom-menu zoals in de ThinQ-app"
# Zet de versie in dist/thinq-airco-card.js, schrijft de wijziging in CHANGELOG.md, commit, tagt en pusht.
# GitHub Actions maakt daarna de release; Home Assistant (Marktplaats/HACS) toont hem als update.
param(
  [Parameter(Mandatory = $true)][ValidatePattern('^\d+\.\d+\.\d+$')][string]$Versie,
  [Parameter(Mandatory = $true)][string]$Wijziging
)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)

if (git tag --list "v$Versie") { throw "Tag v$Versie bestaat al" }

$js = 'dist/thinq-airco-card.js'
$t = [IO.File]::ReadAllText((Resolve-Path $js), $utf8)
if ($t -notmatch "const LG_VERSION = '[^']+';") { throw 'LG_VERSION niet gevonden' }
$t = [regex]::Replace($t, "const LG_VERSION = '[^']+';", "const LG_VERSION = '$Versie';")
[IO.File]::WriteAllText((Resolve-Path $js), $t, $utf8)

$cl = [IO.File]::ReadAllText((Resolve-Path 'CHANGELOG.md'), $utf8)
$regels = ($Wijziging -split '\s*;\s*' | ForEach-Object { "- $_" }) -join "`n"
$entry = "## $Versie — $(Get-Date -Format 'yyyy-MM-dd')`n`n$regels`n`n"
$cl = $cl -replace '^# Changelog\s*\n', "# Changelog`n`n$entry"
[IO.File]::WriteAllText((Resolve-Path 'CHANGELOG.md'), $cl, $utf8)

git add -A
git commit -m "Release v$Versie" -m $Wijziging
git tag "v$Versie"
git push
git push origin "v$Versie"
"v$Versie gepusht. Release verschijnt over ~1 minuut op https://github.com/schmeitz/thinq-airco-card/releases"

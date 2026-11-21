# Release a new version of ThinQ Airco Card.
# Usage:  .\release.ps1 1.5.2 "First change; second change"
# Sets the version in dist/thinq-airco-card.js, adds the changes to CHANGELOG.md, commits, tags and pushes.
# GitHub Actions then creates the release; the Home Assistant marketplace (HACS) offers it as an update.
param(
  [Parameter(Mandatory = $true)][ValidatePattern('^\d+\.\d+\.\d+$')][string]$Version,
  [Parameter(Mandatory = $true)][string]$Changes
)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)

if (git tag --list "v$Version") { throw "Tag v$Version already exists" }
$items = @($Changes -split '\s*;\s*' | Where-Object { $_ })

$js = 'dist/thinq-airco-card.js'
$t = [IO.File]::ReadAllText((Resolve-Path $js), $utf8)
if ($t -notmatch "const LG_VERSION = '[^']+';") { throw 'LG_VERSION not found' }
$t = [regex]::Replace($t, "const LG_VERSION = '[^']+';", "const LG_VERSION = '$Version';")
[IO.File]::WriteAllText((Resolve-Path $js), $t, $utf8)

$cl = [IO.File]::ReadAllText((Resolve-Path 'CHANGELOG.md'), $utf8)
$list = ($items | ForEach-Object { "- $_" }) -join "`n"
$entry = "## $Version — $(Get-Date -Format 'yyyy-MM-dd')`n`n$list`n`n"
$cl = $cl -replace '^# Changelog\s*\n', "# Changelog`n`n$entry"
[IO.File]::WriteAllText((Resolve-Path 'CHANGELOG.md'), $cl, $utf8)

# git writes progress to stderr; that is not an error, so check the exit code instead.
$ErrorActionPreference = 'Continue'
$gitExe = (Get-Command git -CommandType Application | Select-Object -First 1).Source
function Invoke-Git { & $gitExe @args 2>&1 | ForEach-Object { "$_" }; if ($LASTEXITCODE -ne 0) { throw "git $($args -join ' ') failed ($LASTEXITCODE)" } }
$title = "Release ${Version}: $($items[0].Substring(0,1).ToLower() + $items[0].Substring(1))"
if ($title.Length -gt 72) { $title = "Release $Version" }
Invoke-Git add -A
Invoke-Git commit -m $title -m $list
Invoke-Git tag "v$Version"
Invoke-Git push
Invoke-Git push origin "v$Version"
"v$Version pushed. The release appears in about a minute at https://github.com/schmeitz/thinq-airco-card/releases"

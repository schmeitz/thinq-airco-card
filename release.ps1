# Release a new version of ThinQ Airco Card.
# Usage:  .\release.ps1 1.5.2 "First change; second change"
# Sets the version in dist/thinq-airco-card.js, adds the changes to CHANGELOG.md, commits, tags and pushes.
# GitHub Actions then creates the release; the Home Assistant marketplace (HACS) offers it as an update.
#
# Release notes are what users read in the Home Assistant update dialog. For anything more than a small fix,
# write the section "## X.Y.Z - date" in CHANGELOG.md by hand first (intro line, New / Improved / Fixed,
# English first, Dutch below) and run:  .\release.ps1 1.6.0 -Title "console unit and electric heater"
param(
  [Parameter(Mandatory = $true)][ValidatePattern('^\d+\.\d+\.\d+$')][string]$Version,
  [string]$Changes,
  [string]$Title
)
$ErrorActionPreference = 'Stop'
Set-Location $PSScriptRoot
$utf8 = New-Object System.Text.UTF8Encoding($false)

if (git tag --list "v$Version") { throw "Tag v$Version already exists" }
$items = @($Changes -split '\s*;\s*' | Where-Object { $_ })
$written = [IO.File]::ReadAllText((Resolve-Path 'CHANGELOG.md'), $utf8) -match "(?m)^## $([regex]::Escape($Version)) "
if (-not $items -and -not $written) { throw "Write a '## $Version' section in CHANGELOG.md first, or pass -Changes" }
if ($items -and $written) { throw "CHANGELOG.md already has a '## $Version' section; leave out -Changes" }

$js = 'dist/thinq-airco-card.js'
$t = [IO.File]::ReadAllText((Resolve-Path $js), $utf8)
if ($t -notmatch "const LG_VERSION = '[^']+';") { throw 'LG_VERSION not found' }
$t = [regex]::Replace($t, "const LG_VERSION = '[^']+';", "const LG_VERSION = '$Version';")
[IO.File]::WriteAllText((Resolve-Path $js), $t, $utf8)

$cl = [IO.File]::ReadAllText((Resolve-Path 'CHANGELOG.md'), $utf8)
if ($items) {
  $list = ($items | ForEach-Object { "- $_" }) -join "`n"
  $entry = "## $Version — $(Get-Date -Format 'yyyy-MM-dd')`n`n$list`n`n"
  $cl = $cl -replace '^# Changelog\s*\n', "# Changelog`n`n$entry"
  [IO.File]::WriteAllText((Resolve-Path 'CHANGELOG.md'), $cl, $utf8)
} else {
  # hand-written section: the commit body is its English bullet list (everything above the '---' line)
  $sec = [regex]::Match($cl, "(?ms)^## $([regex]::Escape($Version)) [^\n]*\n(.*?)(?=^## |\z)").Groups[1].Value
  $list = (($sec -split '(?m)^---\s*$')[0] -split "`r?`n" | Where-Object { $_ -match '^- ' }) -join "`n"
}

# git writes progress to stderr; that is not an error, so check the exit code instead.
$ErrorActionPreference = 'Continue'
$gitExe = (Get-Command git -CommandType Application | Select-Object -First 1).Source
function Invoke-Git { & $gitExe @args 2>&1 | ForEach-Object { "$_" }; if ($LASTEXITCODE -ne 0) { throw "git $($args -join ' ') failed ($LASTEXITCODE)" } }
$summary = if ($Title) { $Title } elseif ($items) { $items[0].Substring(0,1).ToLower() + $items[0].Substring(1) } else { '' }
$title = if ($summary) { "Release ${Version}: $summary" } else { "Release $Version" }
if ($title.Length -gt 72) { $title = "Release $Version" }
# The message goes through a file: Windows PowerShell mangles double quotes in arguments to git.exe.
$msgFile = Join-Path ([IO.Path]::GetTempPath()) "thinq-release-$Version.txt"
[IO.File]::WriteAllText($msgFile, "$title`n`n$($list -replace '\*\*', '')`n", $utf8)
Invoke-Git add -A
Invoke-Git commit -F $msgFile
Remove-Item $msgFile -ErrorAction SilentlyContinue
Invoke-Git tag "v$Version"
Invoke-Git push
Invoke-Git push origin "v$Version"
"v$Version pushed. The release appears in about a minute at https://github.com/schmeitz/thinq-airco-card/releases"

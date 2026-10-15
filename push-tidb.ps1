param(
    [string]$Fak = "fst",
    [string]$Db = "fakultas_fst"
)

# Jalankan dari C:\Website_Fakultas:  .\push-tidb.ps1
# Fakultas lain:                      .\push-tidb.ps1 -Fak feb -Db fakultas_feb

$backend = Join-Path $PSScriptRoot "web-$Fak\backend"
if (-not (Test-Path $backend)) {
    Write-Host "Folder tidak ditemukan: $backend" -ForegroundColor Red
    exit 1
}

$h = (Read-Host "Host TiDB (tanpa https://, contoh gateway01.xxx.tidbcloud.com)").Trim()
$u = (Read-Host "User (contoh 4aBcDeF.root)").Trim()
$sp = Read-Host "Password" -AsSecureString
$pw = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($sp))

if (-not $h -or -not $u -or -not $pw) {
    Write-Host "Host, user, dan password tidak boleh kosong." -ForegroundColor Red
    exit 1
}
if ($h -match "\s|/|:|@") {
    Write-Host "Host tidak valid. Isi hanya nama host-nya saja, tanpa https:// dan tanpa port." -ForegroundColor Red
    exit 1
}

$env:DATABASE_URL = "mysql://$([uri]::EscapeDataString($u)):$([uri]::EscapeDataString($pw))@${h}:4000/${Db}?sslaccept=strict"
Write-Host ""
Write-Host "Menerapkan skema ke host: $h  database: $Db" -ForegroundColor Cyan

Push-Location $backend
try {
    npx prisma db push
}
finally {
    Pop-Location
    Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
}
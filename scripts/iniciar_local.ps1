# Iniciar Luz Celestia V7 localmente en Windows (requiere Node.js 20 o superior)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw 'Instala Node.js LTS antes de ejecutar esta web.' }
npm run build
if ($LASTEXITCODE -ne 0) { throw 'No se pudo compilar el sitio.' }
npm run dev

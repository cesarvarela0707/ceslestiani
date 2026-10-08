# Ejecutar en PowerShell SOLO una vez que Work/Codex haya generado el proyecto npm.
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { throw 'Instala Node.js LTS (incluye npm) antes de continuar.' }
if (-not (Test-Path './package.json')) { throw 'La web todavía no está creada. Ejecuta primero el prompt en Work/Codex.' }
if (-not (Test-Path './node_modules')) {
  if (Test-Path './package-lock.json') { npm ci } else { npm install }
  if ($LASTEXITCODE -ne 0) { throw 'Falló la instalación.' }
}
npm run dev

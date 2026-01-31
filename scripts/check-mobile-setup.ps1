# Script de Vérification de l'Environnement Mobile - FootballHub+
# Usage: .\scripts\check-mobile-setup.ps1

Write-Host "🔍 Vérification de l'environnement de développement mobile" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Gray
Write-Host ""

$allGood = $true

# Fonction pour vérifier une commande
function Test-Command {
    param(
        [string]$Command,
        [string]$Name,
        [string]$InstallInstructions
    )
    
    Write-Host "Vérification de $Name..." -NoNewline
    
    if (Get-Command $Command -ErrorAction SilentlyContinue) {
        Write-Host " ✅" -ForegroundColor Green
        
        # Afficher la version si possible
        try {
            $version = & $Command --version 2>&1 | Select-Object -First 1
            Write-Host "   Version: $version" -ForegroundColor Gray
        }
        catch {
            Write-Host "   Installé" -ForegroundColor Gray
        }
        
        return $true
    }
    else {
        Write-Host " ❌" -ForegroundColor Red
        Write-Host "   Installation: $InstallInstructions" -ForegroundColor Yellow
        return $false
    }
}

# Fonction pour vérifier un fichier/dossier
function Test-PathExists {
    param(
        [string]$Path,
        [string]$Name
    )
    
    Write-Host "Vérification de $Name..." -NoNewline
    
    if (Test-Path $Path) {
        Write-Host " ✅" -ForegroundColor Green
        return $true
    }
    else {
        Write-Host " ❌" -ForegroundColor Red
        return $false
    }
}

# === VÉRIFICATIONS GÉNÉRALES ===
Write-Host "📦 Outils Généraux" -ForegroundColor Cyan
Write-Host "-" * 60 -ForegroundColor Gray

$allGood = (Test-Command "node" "Node.js" "https://nodejs.org") -and $allGood
$allGood = (Test-Command "npm" "NPM" "Inclus avec Node.js") -and $allGood
$allGood = (Test-Command "npx" "NPX" "Inclus avec Node.js") -and $allGood
$allGood = (Test-Command "git" "Git" "https://git-scm.com") -and $allGood

Write-Host ""

# === VÉRIFICATIONS CAPACITOR ===
Write-Host "⚡ Capacitor" -ForegroundColor Cyan
Write-Host "-" * 60 -ForegroundColor Gray

$allGood = (Test-PathExists "capacitor.config.json" "Configuration Capacitor") -and $allGood
$allGood = (Test-PathExists "node_modules/@capacitor/core" "Capacitor Core") -and $allGood
$allGood = (Test-PathExists "node_modules/@capacitor/cli" "Capacitor CLI") -and $allGood

Write-Host ""

# === VÉRIFICATIONS ANDROID ===
Write-Host "🤖 Android" -ForegroundColor Cyan
Write-Host "-" * 60 -ForegroundColor Gray

$allGood = (Test-PathExists "android" "Projet Android") -and $allGood
$allGood = (Test-Command "java" "Java JDK" "https://www.oracle.com/java/technologies/downloads/") -and $allGood

# Vérifier Android Studio (Windows)
if ($IsWindows) {
    $androidStudioPaths = @(
        "$env:ProgramFiles\Android\Android Studio\bin\studio64.exe",
        "$env:LOCALAPPDATA\Programs\Android\Android Studio\bin\studio64.exe"
    )
    
    $androidStudioFound = $false
    foreach ($path in $androidStudioPaths) {
        if (Test-Path $path) {
            $androidStudioFound = $true
            break
        }
    }
    
    Write-Host "Vérification de Android Studio..." -NoNewline
    if ($androidStudioFound) {
        Write-Host " ✅" -ForegroundColor Green
    }
    else {
        Write-Host " ❌" -ForegroundColor Red
        Write-Host "   Installation: https://developer.android.com/studio" -ForegroundColor Yellow
        $allGood = $false
    }
}

# Vérifier ANDROID_HOME
Write-Host "Vérification de ANDROID_HOME..." -NoNewline
if ($env:ANDROID_HOME -or $env:ANDROID_SDK_ROOT) {
    Write-Host " ✅" -ForegroundColor Green
    $sdkPath = if ($env:ANDROID_HOME) { $env:ANDROID_HOME } else { $env:ANDROID_SDK_ROOT }
    Write-Host "   Path: $sdkPath" -ForegroundColor Gray
}
else {
    Write-Host " ⚠️" -ForegroundColor Yellow
    Write-Host "   Configurer ANDROID_HOME dans les variables d'environnement" -ForegroundColor Yellow
}

Write-Host ""

# === VÉRIFICATIONS iOS (si macOS) ===
if ($IsMacOS) {
    Write-Host "🍎 iOS" -ForegroundColor Cyan
    Write-Host "-" * 60 -ForegroundColor Gray
    
    $allGood = (Test-PathExists "ios" "Projet iOS") -and $allGood
    $allGood = (Test-Command "xcodebuild" "Xcode" "App Store") -and $allGood
    $allGood = (Test-Command "pod" "CocoaPods" "sudo gem install cocoapods") -and $allGood
    
    Write-Host ""
}
else {
    Write-Host "🍎 iOS" -ForegroundColor Cyan
    Write-Host "-" * 60 -ForegroundColor Gray
    Write-Host "⚠️  Le développement iOS nécessite macOS" -ForegroundColor Yellow
    Write-Host ""
}

# === VÉRIFICATIONS PROJET ===
Write-Host "📁 Structure du Projet" -ForegroundColor Cyan
Write-Host "-" * 60 -ForegroundColor Gray

$allGood = (Test-PathExists "package.json" "package.json") -and $allGood
$allGood = (Test-PathExists "node_modules" "node_modules") -and $allGood
$allGood = (Test-PathExists "src" "Dossier src") -and $allGood
$allGood = (Test-PathExists "dist" "Dossier dist (build)") -and $allGood

Write-Host ""

# === VÉRIFICATIONS PLUGINS CAPACITOR ===
Write-Host "🔌 Plugins Capacitor" -ForegroundColor Cyan
Write-Host "-" * 60 -ForegroundColor Gray

$plugins = @(
    "@capacitor/android",
    "@capacitor/ios",
    "@capacitor/camera",
    "@capacitor/splash-screen",
    "@capacitor/status-bar",
    "@capacitor/keyboard"
)

foreach ($plugin in $plugins) {
    $pluginPath = "node_modules/$plugin"
    Test-PathExists $pluginPath $plugin | Out-Null
}

Write-Host ""

# === RÉSUMÉ ===
Write-Host "=" * 60 -ForegroundColor Gray
if ($allGood) {
    Write-Host "✅ Environnement prêt pour le développement mobile!" -ForegroundColor Green
}
else {
    Write-Host "⚠️  Certains outils sont manquants. Installez-les avant de continuer." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📚 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "   1. Installer les outils manquants" -ForegroundColor White
Write-Host "   2. Exécuter: npm run build" -ForegroundColor White
Write-Host "   3. Exécuter: npx cap sync" -ForegroundColor White
Write-Host "   4. Utiliser: .\scripts\deploy-mobile.ps1 -Platform android" -ForegroundColor White
Write-Host ""
Write-Host "📖 Documentation complète: guide_mobile_deployment.md" -ForegroundColor Cyan

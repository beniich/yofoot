# Script de Déploiement Mobile - FootballHub+
# Usage: .\scripts\deploy-mobile.ps1 -Platform [ios|android|both] -Mode [debug|release]

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('ios', 'android', 'both')]
    [string]$Platform,
    
    [Parameter(Mandatory = $false)]
    [ValidateSet('debug', 'release')]
    [string]$Mode = 'debug'
)

Write-Host ">>> FootballHub+ - Deploiement Mobile" -ForegroundColor Cyan
Write-Host "Platform: $Platform | Mode: $Mode" -ForegroundColor Yellow
Write-Host ""

# Fonction pour configurer l'environnement
function Setup-Environment {
    Write-Host "Configuration de l'environnement..." -ForegroundColor Cyan
    
    # Chemins courants pour Android Studio / Java
    $possibleJavaPaths = @(
        "C:\Program Files\Android\Android Studio\jbr",
        "C:\Program Files\Android\Android Studio\jre",
        "$env:JAVA_HOME"
    )
    
    $possibleSdkPaths = @(
        "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk",
        "$env:LOCALAPPDATA\Android\Sdk",
        "$env:ANDROID_HOME"
    )

    $javaFound = $false
    foreach ($path in $possibleJavaPaths) {
        if ($path -and (Test-Path $path)) {
            $env:JAVA_HOME = $path
            $env:Path = "$path\bin;$env:Path"
            Write-Host "JAVA_HOME trouve: $path" -ForegroundColor Green
            $javaFound = $true
            break
        }
    }

    $sdkFound = $false
    foreach ($path in $possibleSdkPaths) {
        if ($path -and (Test-Path $path)) {
            $env:ANDROID_HOME = $path
            $env:ANDROID_SDK_ROOT = $path
            $env:Path = "$path\platform-tools;$env:Path"
            Write-Host "ANDROID_HOME trouve: $path" -ForegroundColor Green
            $sdkFound = $true
            break
        }
    }
    
    if (-not $javaFound) { Write-Host "ATTENTION: Java non detecte automatiquement" -ForegroundColor Yellow }
    if (-not $sdkFound) { Write-Host "ATTENTION: Android SDK non detecte automatiquement" -ForegroundColor Yellow }
    Write-Host ""
}

# Fonction pour vérifier les prérequis
function Test-Prerequisites {
    Write-Host "Verification des prerequis..." -ForegroundColor Cyan
    
    Setup-Environment

    # Node.js
    if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
        Write-Host "ERREUR: Node.js n'est pas installe" -ForegroundColor Red
        exit 1
    }
    Write-Host "Node.js: $(node --version)" -ForegroundColor Green
    
    # Capacitor CLI
    if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
        Write-Host "ERREUR: NPX n'est pas disponible" -ForegroundColor Red
        exit 1
    }
    Write-Host "NPX disponible" -ForegroundColor Green
    
    Write-Host ""
}

# Fonction pour build le frontend
function Build-Frontend {
    Write-Host "Build du frontend..." -ForegroundColor Cyan
    
    npm run build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR lors du build frontend" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Frontend build avec succes" -ForegroundColor Green
    Write-Host ""
}

# Fonction pour synchroniser Capacitor
function Sync-Capacitor {
    param([string]$TargetPlatform)
    
    Write-Host "Synchronisation Capacitor pour $TargetPlatform..." -ForegroundColor Cyan
    
    if ($TargetPlatform -eq 'both') {
        npx cap sync
    }
    else {
        npx cap sync $TargetPlatform
    }
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERREUR lors de la synchronisation" -ForegroundColor Red
        exit 1
    }
    
    Write-Host "Synchronisation reussie" -ForegroundColor Green
    Write-Host ""
}

# Fonction pour ouvrir le projet iOS
function Open-iOS {
    Write-Host "Ouverture du projet iOS dans Xcode..." -ForegroundColor Cyan
    
    if ($IsMacOS) {
        npx cap open ios
        Write-Host "Projet iOS ouvert dans Xcode" -ForegroundColor Green
        Write-Host "Prochaines etapes:" -ForegroundColor Yellow
        Write-Host "   1. Selectionner votre equipe de developpement" -ForegroundColor White
        Write-Host "   2. Selectionner un simulateur ou appareil" -ForegroundColor White
        Write-Host "   3. Cliquer sur Run" -ForegroundColor White
    }
    else {
        Write-Host "ATTENTION: Le deploiement iOS necessite macOS" -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# Fonction pour ouvrir le projet Android
function Open-Android {
    Write-Host "Ouverture du projet Android dans Android Studio..." -ForegroundColor Cyan
    
    npx cap open android
    
    Write-Host "Projet Android ouvert dans Android Studio" -ForegroundColor Green
    Write-Host "Prochaines etapes:" -ForegroundColor Yellow
    Write-Host "   1. Attendre la synchronisation Gradle" -ForegroundColor White
    Write-Host "   2. Selectionner un emulateur ou appareil" -ForegroundColor White
    Write-Host "   3. Cliquer sur Run (play)" -ForegroundColor White
    Write-Host ""
}

# Fonction pour build Android Release
function Build-AndroidRelease {
    Write-Host "Build Android Release..." -ForegroundColor Cyan
    
    Push-Location android
    
    # Build AAB pour Google Play
    Write-Host "Generation de l'Android App Bundle (AAB)..." -ForegroundColor Cyan
    if ($IsWindows) {
        .\gradlew.bat bundleRelease
    }
    else {
        ./gradlew bundleRelease
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "AAB genere avec succes!" -ForegroundColor Green
        Write-Host "Fichier: android\app\build\outputs\bundle\release\app-release.aab" -ForegroundColor Yellow
    }
    else {
        Write-Host "ERREUR lors de la generation de l'AAB" -ForegroundColor Red
    }
    
    # Build APK pour tests
    Write-Host ""
    Write-Host "Generation de l'APK Release..." -ForegroundColor Cyan
    if ($IsWindows) {
        .\gradlew.bat assembleRelease
    }
    else {
        ./gradlew assembleRelease
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "APK genere avec succes!" -ForegroundColor Green
        Write-Host "Fichier: android\app\build\outputs\apk\release\app-release.apk" -ForegroundColor Yellow
    }
    else {
        Write-Host "ERREUR lors de la generation de l'APK" -ForegroundColor Red
    }
    
    Pop-Location
    Write-Host ""
}

# Fonction pour afficher les informations de version
function Show-VersionInfo {
    Write-Host "Informations de version:" -ForegroundColor Cyan
    
    $packageJson = Get-Content package.json | ConvertFrom-Json
    Write-Host "   Version package.json: $($packageJson.version)" -ForegroundColor White
    
    if (Test-Path "android\app\build.gradle") {
        $gradleContent = Get-Content "android\app\build.gradle" -Raw
        if ($gradleContent -match 'versionName\s+"([^"]+)"') {
            Write-Host "   Version Android: $($Matches[1])" -ForegroundColor White
        }
        if ($gradleContent -match 'versionCode\s+(\d+)') {
            Write-Host "   Build Android: $($Matches[1])" -ForegroundColor White
        }
    }
    
    Write-Host ""
}

# Exécution principale
Test-Prerequisites
Show-VersionInfo
Build-Frontend
Sync-Capacitor -TargetPlatform $Platform

# Déploiement selon la plateforme
switch ($Platform) {
    'ios' {
        if ($Mode -eq 'release') {
            Write-Host "ATTENTION: Pour iOS Release, utilisez Xcode:" -ForegroundColor Yellow
            Write-Host "   Product -> Archive -> Distribute App" -ForegroundColor White
            Write-Host ""
        }
        Open-iOS
    }
    'android' {
        if ($Mode -eq 'release') {
            Build-AndroidRelease
        }
        else {
            Open-Android
        }
    }
    'both' {
        if ($Mode -eq 'release') {
            Write-Host "ATTENTION: Mode Release pour iOS necessite Xcode" -ForegroundColor Yellow
            Build-AndroidRelease
        }
        else {
            Open-iOS
            Open-Android
        }
    }
}

Write-Host "Deploiement termine!" -ForegroundColor Green
Write-Host ""
Write-Host "Pour plus de details, consultez:" -ForegroundColor Cyan
Write-Host "   guide_mobile_deployment.md" -ForegroundColor White

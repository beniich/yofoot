# Script pour lancer Android Studio avec la bonne configuration
# Usage: .\scripts\open-android.ps1

Write-Host "🚀 Lancement d'Android Studio..." -ForegroundColor Cyan

# Configuration des chemins
$javaPath = "C:\Program Files\Android\Android Studio\jbr"
$sdkPath = "C:\Users\pc gold\AppData\Local\Android\Sdk"

# Vérification
if (-not (Test-Path $javaPath)) {
    Write-Host "❌ Java non trouvé à: $javaPath" -ForegroundColor Red
    exit 1
}
if (-not (Test-Path $sdkPath)) {
    Write-Host "❌ Android SDK non trouvé à: $sdkPath" -ForegroundColor Red
    exit 1
}

# Configuration de l'environnement pour la session actuelle
$env:JAVA_HOME = $javaPath
$env:ANDROID_HOME = $sdkPath
$env:ANDROID_SDK_ROOT = $sdkPath
$env:Path = "$javaPath\bin;$sdkPath\platform-tools;$sdkPath\cmdline-tools\latest\bin;$env:Path"

Write-Host "✅ Variables d'environnement configurées" -ForegroundColor Green
Write-Host "   JAVA_HOME: $env:JAVA_HOME" -ForegroundColor Gray
Write-Host "   ANDROID_HOME: $env:ANDROID_HOME" -ForegroundColor Gray

# Lancement via Capacitor
Write-Host "📱 Ouverture du projet..." -ForegroundColor Cyan
npx cap open android

Write-Host "✨ Android Studio devrait s'ouvrir." -ForegroundColor Green
Write-Host "ℹ️  Une fois ouvert, attendez la fin de l'indexation et du sync Gradle (barre de progression en bas)." -ForegroundColor Yellow
Write-Host "ℹ️  Ensuite, cliquez sur le bouton 'Play' (▶️) vert en haut pour lancer l'app." -ForegroundColor Yellow

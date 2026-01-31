# 📱 Guide Rapide - Déploiement Mobile

## 🚀 Démarrage Rapide

### 1️⃣ Vérifier l'Environnement

```bash
# Vérifier que tout est installé
.\scripts\check-mobile-setup.ps1
```

### 2️⃣ Build & Déployer

```bash
# Android (Debug)
.\scripts\deploy-mobile.ps1 -Platform android -Mode debug

# Android (Release - APK + AAB)
.\scripts\deploy-mobile.ps1 -Platform android -Mode release

# iOS (nécessite macOS)
.\scripts\deploy-mobile.ps1 -Platform ios -Mode debug
```

---

## 📋 Commandes Essentielles

### Build Frontend
```bash
npm run build
```

### Synchroniser Capacitor
```bash
npx cap sync              # Toutes les plateformes
npx cap sync android      # Android uniquement
npx cap sync ios          # iOS uniquement
```

### Ouvrir les Projets Natifs
```bash
npx cap open android      # Android Studio
npx cap open ios          # Xcode (macOS)
```

### Tests en Temps Réel
```bash
npx cap run android --livereload
npx cap run ios --livereload
```

---

## 🤖 Android - Build Release

### Générer AAB (Google Play)
```bash
cd android
.\gradlew.bat bundleRelease
# Fichier: android\app\build\outputs\bundle\release\app-release.aab
```

### Générer APK (Tests)
```bash
cd android
.\gradlew.bat assembleRelease
# Fichier: android\app\build\outputs\apk\release\app-release.apk
```

---

## 🍎 iOS - Build Release

1. Ouvrir Xcode: `npx cap open ios`
2. **Product** → **Archive**
3. **Window** → **Organizer**
4. **Distribute App** → **App Store Connect**

---

## 🔑 Prérequis

### Android
- ✅ Android Studio
- ✅ JDK 11+
- ✅ Clé de signature créée

### iOS (macOS uniquement)
- ✅ Xcode 14+
- ✅ CocoaPods
- ✅ Apple Developer Account

---

## 📚 Documentation Complète

Pour plus de détails, consultez [guide_mobile_deployment.md](file:///C:/Users/pc%20gold/.gemini/antigravity/brain/b4380426-e9db-4104-a2a9-204631a392c2/guide_mobile_deployment.md)

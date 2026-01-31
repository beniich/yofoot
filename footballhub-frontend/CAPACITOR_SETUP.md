# 📱 Configuration Capacitor - FootballHub+

## ✅ Configuration Complétée

### Fichiers Créés

#### Configuration
- ✅ `capacitor.config.ts` - Configuration principale avec plugins

#### Utilitaires (`src/utils/`)
- ✅ `platform.ts` - Détection de plateforme et API URL
- ✅ `haptics.ts` - Feedback haptique
- ✅ `qrScanner.ts` - Scanner QR code
- ✅ `pushNotifications.ts` - Push notifications
- ✅ `statusBar.ts` - Contrôle de la barre de statut
- ✅ `splashScreen.ts` - Contrôle du splash screen

#### Composants (`src/components/`)
- ✅ `QRScanner.tsx` - Composant scanner QR
- ✅ `SafeArea.tsx` - Gestion des zones sûres iOS
- ✅ `ShareButton.tsx` - Bouton de partage natif

## 📦 Plugins en cours d'installation

```bash
@capacitor/android
@capacitor/ios
@capacitor/camera
@capacitor/push-notifications
@capacitor/status-bar
@capacitor/splash-screen
@capacitor/keyboard
@capacitor/share
@capacitor/filesystem
@capacitor/app
@capacitor/network
@capacitor/haptics
@capacitor-community/barcode-scanner
```

## 🚀 Prochaines Étapes

### 1. Ajouter les scripts au package.json

```json
{
  "scripts": {
    "cap:sync": "npm run build && npx cap sync",
    "cap:sync:ios": "npm run build && npx cap sync ios",
    "cap:sync:android": "npm run build && npx cap sync android",
    "cap:open:ios": "npx cap open ios",
    "cap:open:android": "npx cap open android",
    "cap:run:ios": "npm run build && npx cap sync ios && npx cap run ios",
    "cap:run:android": "npm run build && npx cap sync android && npx cap run android"
  }
}
```

### 2. Build le projet

```bash
npm run build
```

### 3. Ajouter les plateformes

```bash
# Android
npx cap add android

# iOS (macOS uniquement)
npx cap add ios
```

### 4. Synchroniser

```bash
npx cap sync
```

### 5. Ouvrir dans l'IDE natif

```bash
# Android Studio
npx cap open android

# Xcode (macOS)
npx cap open ios
```

## 📝 Configuration Android

### AndroidManifest.xml

Ajouter les permissions dans `android/app/src/main/AndroidManifest.xml` :

```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.CAMERA" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE"/>
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.VIBRATE" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
```

## 📝 Configuration iOS

### Info.plist

Ajouter les permissions dans `ios/App/App/Info.plist` :

```xml
<key>NSCameraUsageDescription</key>
<string>FootballHub+ a besoin d'accéder à la caméra pour scanner les billets QR</string>

<key>NSPhotoLibraryUsageDescription</key>
<string>FootballHub+ a besoin d'accéder à vos photos</string>
```

## 🎯 Utilisation dans le Code

### Scanner QR

```tsx
import { QRScanner } from '@/components/QRScanner';

function TicketPage() {
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = (data: string) => {
    console.log('QR Code:', data);
    // Traiter le code QR
  };

  return (
    <>
      <button onClick={() => setShowScanner(true)}>
        Scanner un billet
      </button>
      
      {showScanner && (
        <QRScanner
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </>
  );
}
```

### Haptic Feedback

```tsx
import { hapticFeedback } from '@/utils/haptics';

// Dans un bouton
const handleClick = async () => {
  await hapticFeedback.light();
  // Action
};

// Notification de succès
await hapticFeedback.notification('success');
```

### Partage

```tsx
import { ShareButton } from '@/components/ShareButton';

<ShareButton
  title="Match Raja vs Wydad"
  text="Regardez ce match incroyable !"
  url="https://footballhub.ma/matches/123"
/>
```

### Détection de Plateforme

```tsx
import { isNative, isIOS, isAndroid } from '@/utils/platform';

if (isNative()) {
  // Code spécifique mobile
}

if (isIOS()) {
  // Code spécifique iOS
}

if (isAndroid()) {
  // Code spécifique Android
}
```

## ✅ Checklist

- [x] Capacitor installé
- [x] Configuration créée
- [x] Utilitaires créés
- [x] Composants créés
- [ ] Plugins installés (en cours)
- [ ] Build du projet
- [ ] Plateformes ajoutées
- [ ] Configuration Android
- [ ] Configuration iOS
- [ ] Tests sur émulateur/appareil

## 📚 Documentation

- [Capacitor Docs](https://capacitorjs.com/docs)
- [Capacitor Plugins](https://capacitorjs.com/docs/plugins)
- [Barcode Scanner](https://github.com/capacitor-community/barcode-scanner)

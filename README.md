

"# CEREBRIN"

## Requisitos
- Node.js (LTS recomendado)
- Expo CLI (se usa via `npx expo`)
- Para iOS: Xcode + simulador
- Para Android: Android Studio + emulador

## Instalacion
```
npm install
```

## Ejecutar en desarrollo
### Web
```
npm run web
```

### iOS (simulador)
```
npm run ios
```

### Android (emulador)
```
npm run android
```

### Servidor Metro (sin abrir plataforma)
```
npm run start
```

## Dev Client (recomendado para testing en device)
1. Compilar el dev client una vez (iOS/Android):
```
npx eas build --profile development --platform ios
npx eas build --profile development --platform android
```
2. Lanzar Metro en modo dev-client:
```
npx expo start --dev-client
```

## Builds (EAS)
### Preview (distribucion interna)
```
eas build --profile preview --platform ios
eas build --profile preview --platform android
```

### Produccion (store)
```
eas build --profile production --platform ios
eas build --profile production --platform android
```

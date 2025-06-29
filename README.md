# Welcome to your Expo app 👋

Lets check This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

   Use npx expo as expo-cli is deprecated.
   You access it using `npx expo <command>`, which runs the version that matches your project’s Expo SDK

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Creating Builds

eas build --profile development --platform android or eas build --profile preview --platform ios for a Development build which you can share the link and they can download and install the app ONLY when dev server is running; for custom dev client, install expo-dev-client then run the build command

- eas build --profile development --platform android
- https://expo.dev/accounts/clevermissfox/projects/react-native-intro-v1/builds/ecdb30e8-d41e-4677-8c2c-ccd04589eb08
- you do still need the dev server running to load the JavaScript bundle.

when you want to build and not require the dev server at all:

- `eas build --profile preview --platform android`
- https://expo.dev/accounts/clevermissfox/projects/react-native-intro-v1/builds/a11a308a-61c5-4637-9bb3-f2ea5ac1d982

### Production Build

The following commands

- `eas build --profile production --platform android`
- `eas build --profile production --platform ios`

### Production Preview - Custom Build

to get a production ready build (that bundles the javascript) but also spits out an apk for android instead of an app store file

- `eas build --profile prod-preview --platform android`

### Build and Run Locally

Test Release Build Locally: Run `npx expo run:android --variant release` to simulate the EAS Build process on your machine. If it fails locally, it will also fail on EAS Build.

### Local EAS Build

Use `eas build -p android --profile preview --local` to build locally and avoid waiting for remote builds. This helps you catch issues faster.

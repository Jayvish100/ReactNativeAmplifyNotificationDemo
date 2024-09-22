/**
 * @format
 */

import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import {
  Amplify,
  // Notifications
} from 'aws-amplify';
import {
  initializePushNotifications,
  onNotificationReceivedInBackground,
  //   OnNotificationReceivedInBackgroundInput,
} from 'aws-amplify/push-notifications';
import amplifyconfig from './src/amplifyconfiguration.json';

Amplify.configure(amplifyconfig);

// Notifications.Push.enable(); SHOULD WORK ON React Native Amplify V5

/*
    USING REACT NATIVE AMPLIFY V6 with Latest RN 0.75.3 as of (22-09-2024)
    STEP 1: Follow "Set up Amplify prerequisites" (skip "Manually configure the Amplify CLI")
        Link - https://docs.amplify.aws/gen1/react-native/start/project-setup/prerequisites/

    STEP 2: Setup Project ("Initialize a new backend Section" AND "Set up frontend")
        Link - https://docs.amplify.aws/gen1/react-native/start/getting-started/setup/

    STEP 3: Set up Amplify Push Notifications
        Link - https://docs.amplify.aws/gen1/react-native/build-a-backend/push-notifications/set-up-push-notifications/

    AT End you will reach here, Now Next Step is to test the notification. Test code written in App.tsx
*/
initializePushNotifications();

const myAsyncNotificationReceivedHandler = async notification => {
  // Process the received push notification message in the background
};

onNotificationReceivedInBackground(myAsyncNotificationReceivedHandler);

AppRegistry.registerComponent(appName, () => App);

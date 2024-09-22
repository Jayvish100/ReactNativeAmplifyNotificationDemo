/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {
  getPermissionStatus,
  GetPermissionStatusOutput,
  requestPermissions,
  onTokenReceived,
  OnTokenReceivedInput,
  OnTokenReceivedOutput,
  onNotificationReceivedInForeground,
  OnNotificationReceivedInForegroundInput,
  OnNotificationReceivedInForegroundOutput,
} from 'aws-amplify/push-notifications';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const [permStatus, setPermStatus] =
    useState<GetPermissionStatusOutput>('shouldRequest');

  const [foregroundMessage, setForegroundMessage] = useState<any>();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const myTokenReceivedHandler: OnTokenReceivedInput = token => {
    // Do something with the received token
    console.log('FCM Token', token);
  };

  const myNotificationReceivedHandler: OnNotificationReceivedInForegroundInput =
    notification => {
      // Respond to the received push notification message in real time
      console.log('FOREGROUND MESSAGE', notification);
      setForegroundMessage(notification);
    };

  useEffect(() => {
    console.log('Permission Status', permStatus);
  }, [permStatus]);

  useEffect(() => {
    const listener: OnNotificationReceivedInForegroundOutput =
      onNotificationReceivedInForeground(myNotificationReceivedHandler);

    return () => {
      listener.remove(); // Remember to remove the listener when it is no longer needed
    };
  }, [permStatus]);

  useEffect(() => {
    const listener: OnTokenReceivedOutput = onTokenReceived(
      myTokenReceivedHandler,
    );

    return () => {
      listener.remove(); // Remember to remove the listener when it is no longer needed
    };
  }, [permStatus]);

  useEffect(() => {
    async function getNotifyPermission() {
      const status = await getPermissionStatus(); // 'shouldRequest' | 'shouldExplainThenRequest' | 'granted' | 'denied'
      if (status === 'granted') {
        // no further action is required, user has already granted permissions
        setPermStatus(status);
        return;
      }
      if (status === 'denied') {
        // further attempts to request permissions will no longer do anything
        setPermStatus(status);
        return;
      }
      if (status === 'shouldRequest') {
        // go ahead and request permissions from the user
        setPermStatus(status);
        const result = await requestPermissions();
        if (result) {
          setPermStatus('granted');
        } else {
          setPermStatus('denied');
        }
      }
      if (status === 'shouldExplainThenRequest') {
        // you should display some explanation to your user before requesting permissions
        // Here....
        // then request permissions
        await requestPermissions();
      }
      console.log('Permission Status', status);
    }
    getNotifyPermission();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {foregroundMessage?.title && foregroundMessage?.body && (
            <Section title="Recieved Foreground Notification">
              <Text style={styles.highlight}>{foregroundMessage?.title}</Text>
              <Text style={styles.highlight}>{foregroundMessage?.body}</Text>
            </Section>
          )}
          <Section title="Step One">
            Edit <Text style={styles.highlight}>App.tsx</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;

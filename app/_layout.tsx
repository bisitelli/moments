// app/_layout.tsx
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { RootSiblingParent } from 'react-native-root-siblings'; 
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';

// Store and Enum imports
import { useUserAuthStore } from "@/store/auth/use_auth_store";
import { AuthStatus } from "@/domain/model/enums/AuthStatus";
import FullscreenLoader from '@/components/shared/full_screen_loader';

export const unstable_settings = { anchor: '(tabs)' };

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  // Store hooks
  const initializeSession = useUserAuthStore((s) => s.initializeSession);
  const authStatus = useUserAuthStore((s) => s.authStatus);

  // 1. Check session once on app launch
  useEffect(() => {
    initializeSession();
  }, []);

  // 2. Show spinner while checking auth to prevent premature navigation
  if (authStatus === AuthStatus.CHECKING) {
    return (
      <FullscreenLoader/>
    );
  }

  // 3. Render navigation once auth status is known
  return (
    <RootSiblingParent>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(public)" options={{ headerShown: false }} />
          <Stack.Screen name="(private)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </RootSiblingParent>
  );
}
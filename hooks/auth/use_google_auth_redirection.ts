import { useEffect } from "react";
import {
  GoogleSignin,
  statusCodes,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';

export const useGoogleAuthRedirection = (
  onLoginSuccess: (idToken: string) => Promise<void>,
  onLoginFailed: (error: string) => void,
) => {

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '293134271464-kni5th5qgihkdso5nk7ouvcah7rnpct3.apps.googleusercontent.com',
      iosClientId: '293134271464-i4qnsbvso6049ha4eopa4rp5jk1ksrfe.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      offlineAccess: true,
      forceCodeForRefreshToken: false,
    });
  }, []);

  const promptAsync = async () => {
    try {
      // check if users' device has google play services
      await GoogleSignin.hasPlayServices();

      // initiates signIn process
      const response = await GoogleSignin.signIn();

      // Agrega esta línea para ver el error real en la terminal
      console.log(JSON.stringify(response, null, 2));

      // retrieve user data
      const { idToken } = response.data ?? {};

      if (idToken) {
        console.log("ID TOKEN: " + idToken)
        await onLoginSuccess(idToken);
      } else {
        onLoginFailed("No ID Token found");
      }

    } catch (error) {
      console.log('Error', error);

      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.SIGN_IN_CANCELLED:
            onLoginFailed("User cancelled the login flow");
            break;
          case statusCodes.IN_PROGRESS:
            onLoginFailed("Sign in is in progress");
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            onLoginFailed("Play services not available or outdated");
            break;
          default:
            onLoginFailed("Google login failed with code: " + error.code);
        }
      } else {
        onLoginFailed("Google login failed");
      }
    }
  };

  // Return the trigger function. 'request' state is no longer needed in the native flow.
  return { promptAsync };
}
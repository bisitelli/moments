import { useRouter } from "expo-router";
import { useUserAuthStore } from "@/store/auth/use_auth_store";
import { showErrorTop } from "@/shared/utils/show_toast_message";
import { useGoogleAuthRedirection } from "@/hooks/auth/use_google_auth_redirection";

export const useLoginViewModel = () => {
  const router = useRouter();
  
  // Store Selectors
  const loginUser = useUserAuthStore((state) => state.requestLoginEmail);
  const externalLogin = useUserAuthStore((state) => state.requestExternalLogin);
  const isLoading = useUserAuthStore((state) => state.isLoginLoading);

  // Helper for errors
  const handleLoginError = () => {
    // Get the latest error from state or default message
    const errorMsg = useUserAuthStore.getState().errorLogin || "Unknown error";
    showErrorTop(`Login failed: ${errorMsg}`);
  };

  // --- Email Logic ---
  const handleEmailSubmit = async (email: string) => {
    const success = await loginUser(email);

    if (success) {
      router.push("/(public)/verify_email_code_screen");
    } else {
      handleLoginError();
    }
  };

  // --- Google Logic Callbacks ---
  const handleExternalSuccess = async (idToken: string) => {
    const success = await externalLogin(idToken);
    
    if (success) {
       // Logic after success Google Login (e.g., go to Home)
       // router.replace("/(tabs)/home"); 
       console.log("Google Login Success");
    } else {
       handleLoginError();
    }
  };

  const handleExternalFailed = (error: any) => {
    const msg = error?.message || "Google authentication failed";
    showErrorTop(msg);
  };

  // --- Initialize Google Hook ---
  // We pass the callbacks defined above
  const { promptAsync, request } = useGoogleAuthRedirection(
    handleExternalSuccess, 
    handleExternalFailed
  );

  return {
    isLoading,
    isGoogleButtonDisabled: !request,
    handleEmailSubmit,
    handleGooglePress: () => promptAsync(),
    onSignUpPress: () => router.push("/(public)/register_screen"),
  };
};
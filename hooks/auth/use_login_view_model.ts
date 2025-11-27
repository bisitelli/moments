import { useRouter } from "expo-router";
import { useUserAuthStore } from "@/store/auth/use_auth_store";
import { showErrorTop } from "@/shared/utils/show_toast_message";
import { useGoogleAuthRedirection } from "@/hooks/auth/use_google_auth_redirection";

export const useLoginViewModel = () => {
  const router = useRouter();
  
  // Store Selectors
  const loginUser = useUserAuthStore((state) => state.requestLoginEmail);
  const externalLogin = useUserAuthStore((state) => state.requestExternalLogin);
  const isLoginLoading = useUserAuthStore((state) => state.isLoginLoading);
  const isExternalLoginLoading = useUserAuthStore((state) => state.isExternalLoginLoading);

  // --- Email Logic ---
  const handleEmailSubmit = async (email: string) => {
    const success = await loginUser(email);

    if (success) {

      router.push("/(public)/verify_email_code_screen");

    } else {

      const errorMsg = useUserAuthStore.getState().errorLogin || "Unknown error";
      showErrorTop(`Login failed: ${errorMsg}`);

    }
  };

  // --- Google Logic Callbacks ---
  const handleExternalSuccess = async (idToken: string) => {
    const success = await externalLogin(idToken);
    
    if (success) {
      // Logic after success Google Login 
      router.push("/(private)/(tabs)/discover_screen"); 

    } else {
      const errorMsg = useUserAuthStore.getState().errorExternalLogin || "Unknown error";
      showErrorTop(`Login failed: ${errorMsg}`);
    }

  };

  const handleExternalFailed = (error?: string) => {
    const msg = error ?? "Google authentication failed";
    showErrorTop(msg);
  };

  // --- Initialize Google Hook ---
  // We pass the callbacks defined above
  const { promptAsync } = useGoogleAuthRedirection(
    handleExternalSuccess, 
    handleExternalFailed
  );

  return {
    isLoginLoading: isLoginLoading,
    isExternalLoginLoading: isExternalLoginLoading,
    handleEmailSubmit,
    handleGooglePress: () => promptAsync(),
    onSignUpPress: () => router.push("/(public)/register_screen"),
  };
};
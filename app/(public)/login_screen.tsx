import AuthFormView from "@/components/auth/auth_form_view";
import { useLoginViewModel } from "@/hooks/auth/use_login_view_model";

export default function LoginScreen() {
  const { 
    isLoginLoading,
    isExternalLoginLoading, 
    handleEmailSubmit, 
    handleGooglePress, 
    onSignUpPress,
  } = useLoginViewModel();

  return (
    <AuthFormView
      title="Get Started"
      subtitle="Enter your email to log in."
      placeholder="you@example.com"
      submitLabel="Continue with email"
      emptyFieldMessage="Email field is required"
      
      // Props mapped from ViewModel
      isLoginLoading={isLoginLoading}
      isExternalLoginLoading={isExternalLoginLoading}
      showGoogleButton={true}
      
      // Actions
      onSubmit={handleEmailSubmit}
      onGooglePress={handleGooglePress}
      onSignUpPress={onSignUpPress}
      
      // UI Config
      formLabel="Email"
      keyboardType="email-address"
    />
  );
}
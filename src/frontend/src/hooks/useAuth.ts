import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const {
    identity,
    login,
    clear,
    loginStatus,
    isAuthenticated,
    isLoggingIn,
    isInitializing,
  } = useInternetIdentity();

  return {
    identity,
    login,
    logout: clear,
    loginStatus,
    isAuthenticated,
    isLoggingIn,
    isInitializing,
  };
}

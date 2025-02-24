import { create } from 'zustand'
import { supabaseClient } from '../auth/supabase'
import { AuthError, type User } from '@supabase/supabase-js'
import * as AppleAuthentication from 'expo-apple-authentication'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import { makeRedirectUri } from 'expo-auth-session'

export type AuthProps = {
  error?: AuthError | undefined
}

export interface AuthStore {
  user: User | null;
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  signUp: (email: string, password: string) => Promise<AuthProps>;
  signIn: (email: string, password: string) => Promise<AuthProps>;
  googleSignIn: () => Promise<AuthProps>;
  azureSignIn: () => Promise<AuthProps>;
  appleSignIn: () => Promise<AuthProps>;
  setSession: (accessToken: string, refreshToken: string) => Promise<AuthProps>;
  resetPassword: (newPassword: string) => Promise<AuthProps>;
  forgotPassword: (email: string) => Promise<AuthProps>;
  signOut: () => Promise<AuthProps>;
  reset: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isLoggedIn: false,
    setUser: (user: User) => set({ user }),
    setIsLoggedIn: (isLoggedIn: boolean) => set({ isLoggedIn }),
    signUp: async (email: string, password: string) => {
      const supabase = await supabaseClient;
      const { data: exists } = await supabase.rpc('email_exists', { input: email });

      if (exists) {
        return {
          error: {
            message: "Email already exists"
          } as AuthError
        }
      }

      const redirectTo = makeRedirectUri({
        path: '/verifyEmail',
      })
      const { data: { user }, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: redirectTo } });
      if (error) return { error };
      set({ user });
      return {};
    },
    signIn: async (email: string, password: string) => {
      const supabase = await supabaseClient;

      const { data: { user }, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { error };
      set({ user });
      set({ isLoggedIn: true });
      return {};
    },
    googleSignIn: async () => {
      // Does not work on expo go
      const supabase = await supabaseClient;
      await GoogleSignin.hasPlayServices()
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID!,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID!});
      const userInfo = await GoogleSignin.signIn()

      if (!(userInfo?.data?.idToken)) {
        console.error('No idToken');
        return {};
      }
      const { data: { user }, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: userInfo.data.idToken,
      })
      if (error) return { error };
      set({ user });
      set({ isLoggedIn: true });
      return {};
    },
    azureSignIn: async () => {
      return {};
    },
    appleSignIn:  async () => {
      const supabase = await supabaseClient;

      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      })
      // Sign in via Supabase Auth.
      if (!credential.identityToken) {
        console.error('No identityToken');
        return {};
      };
      const { error, data: { user }, } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      })
      if (error) return { error };
      set({ user });
      set({ isLoggedIn: true });
      return {};
    },
    setSession: async (access_token: string, refresh_token: string) => {
      const supabase = await supabaseClient;
      const { data: { user }, error } = await supabase.auth.setSession({ access_token, refresh_token });

      if (error) return { error };
      set({ user: user });
      set({ isLoggedIn: true });
      return {};
    },
    signOut: async () => {
      const supabase = await supabaseClient;
      const { error } = await supabase.auth.signOut();
      if (error) return { error };
      set({ user: null });
      set({ isLoggedIn: false });
      return {};
    },
    forgotPassword: async (email: string) => {
      const supabase = await supabaseClient;
      const redirectTo = makeRedirectUri({
        path: '/passwordRecovery',
      })

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectTo,
      })
      if (error) return { error };
      return {};
    },
    resetPassword: async (newPassword: string) => {
      const supabase = await supabaseClient;

      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) return { error };
      return {};
    },
    reset: () => set(initialState),
}));

const initialState = {
  user: null,
  isLoggedIn: false,
}
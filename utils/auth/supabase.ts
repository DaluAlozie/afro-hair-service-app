import * as SessionStorage from "../storage/sessionStorage"
import { createClient } from '@supabase/supabase-js'
import { AppState, Platform } from "react-native"
import { initializeStorage } from "../storage/initSessionStorage";
import Constants from "expo-constants";
// Alternative storage for Web and Expo Go
import AsyncStorage from '@react-native-async-storage/async-storage'

const supabaseUrl: string = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

const initializeSupabase = async () => {

  if (
    Constants.executionEnvironment === "storeClient" ||
    Platform.OS === "web"
  ) {
    return createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })
  }
  const storageInstance = await initializeStorage();
  SessionStorage.setStorageInstance(storageInstance); // Set the storage instance

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: SessionStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })
}

export const supabaseClient = initializeSupabase();

export { type Session, type AuthError } from "@supabase/supabase-js"

/**
 * Tells Supabase to autorefresh the session while the application
 * is in the foreground. (Docs: https://supabase.com/docs/reference/javascript/auth-startautorefresh)
 */
AppState.addEventListener("change", async (nextAppState) => {
  const supabase = await supabaseClient;
  if (nextAppState === "active") {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})
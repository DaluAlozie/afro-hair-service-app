import * as SecureStore from "expo-secure-store";
import * as Crypto from "expo-crypto";
import { MMKV } from "react-native-mmkv";

export const fetchOrGenerateEncryptionKey = async (): Promise<string> => {
  const encryptionKey = await SecureStore.getItemAsync("session-encryption-key");

  if (encryptionKey) {
    return encryptionKey;
  } else {
    const uuid = Crypto.randomUUID();
    await SecureStore.setItemAsync("session-encryption-key", uuid);
    return uuid;
  }
};

export const initializeStorage = async (): Promise<MMKV> => {
  const encryptionKey = await fetchOrGenerateEncryptionKey();
  const storage = new MMKV({
    id: "session",
    encryptionKey: encryptionKey,
  });
  return storage;
};
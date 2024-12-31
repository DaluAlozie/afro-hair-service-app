import AuthWrapper from "@/components/auth/AuthWrapper";
import { ThemedView } from "@/components/utils";
import React from "react";

export default function Explore() {
  return (
    <AuthWrapper>
      <ThemedView></ThemedView>
    </AuthWrapper>
  );
}

import React, { useEffect } from 'react'
import * as Linking from 'expo-linking'

interface DeepLinkHandlerProps {
  url: string | null;
  setURL: (url: string | null) => void;
  children: React.ReactNode;
}

export default function DeepLinkHandler({ url, setURL, children }: DeepLinkHandlerProps) {
    const currentURL = Linking.useURL();
    useEffect(() => {
        setURL(currentURL ?? Linking.getLinkingURL());
        (async () => { if (!url) setURL(await Linking.getInitialURL()) })();
        return () => {};
      },[currentURL]);
  return (
    <>
        { children }
    </>
  )
}


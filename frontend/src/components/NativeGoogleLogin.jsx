"use client";
import { useEffect, useRef } from "react";

export default function NativeGoogleLogin({ onSuccess, onError, text = "signin_with", width }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!clientId) {
      console.warn("Google Client ID not configured");
      return;
    }

    const initGoogle = () => {
      try {
        if (!window.google) return;
        
        if (!window.googleInitialized) {
          window.googleInitialized = true;
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: (response) => {
              if (response && response.credential) {
                onSuccess(response);
              } else {
                if (onError) onError();
              }
            },
          });
        }
        
        if (containerRef.current) {
          window.google.accounts.id.renderButton(containerRef.current, {
            theme: "outline",
            size: "large",
            text: text,
            width: width || 356,
            shape: "rectangular"
          });
        }
      } catch (err) {
        console.error("Failed to initialize Google Sign-In", err);
      }
    };

    if (window.google) {
      initGoogle();
    } else {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initGoogle;
      document.body.appendChild(script);
    }
  }, [onSuccess, onError, text, width]);

  if (!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID) {
    return null;
  }

  return <div ref={containerRef} style={{ display: "flex", justifyContent: "center" }} />;
}

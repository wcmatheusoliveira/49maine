"use client";

import { useEffect } from "react";

export default function ColorApplier() {
  useEffect(() => {
    async function applyColors() {
      try {
        const response = await fetch('/api/settings');
        if (response.ok) {
          const settings = await response.json();

          // Apply colors to CSS variables
          document.documentElement.style.setProperty('--primary-color', settings.primaryColor);
          document.documentElement.style.setProperty('--secondary-color', settings.secondaryColor);
          document.documentElement.style.setProperty('--accent-color', settings.accentColor);
        }
      } catch (error) {
        console.error('Failed to load color settings:', error);
      }
    }

    applyColors();
  }, []);

  return null;
}

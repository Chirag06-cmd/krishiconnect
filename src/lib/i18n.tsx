
"use client";

import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of your translations
type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

// Define your translations
const translations: Translations = {
  en: {
    'Dashboard': 'Dashboard',
    'Analytics': 'Analytics',
    'Diagnostics': 'Diagnostics',
    'Soil Analysis': 'Soil Analysis',
    'Pest Prediction': 'Pest Prediction',
    'Health Map': 'Health Map',
    'Market': 'Market',
    'Crop Advisor': 'Crop Advisor',
    'Irrigation': 'Irrigation',
    'Weed ID': 'Weed ID',
    'Assistant': 'Assistant',
    'About Us': 'About Us',
    'Support': 'Support',
    'Settings': 'Settings',
    'Log Out': 'Log Out'
  },
  hi: {
    'Dashboard': 'डैशबोर्ड',
    'Analytics': 'एनालिटिक्स',
    'Diagnostics': 'डायग्नोस्टिक्स',
    'Soil Analysis': 'मृदा विश्लेषण',
    'Pest Prediction': 'कीट भविष्यवाणी',
    'Health Map': 'स्वास्थ्य मानचित्र',
    'Market': 'बाजार',
    'Crop Advisor': 'फसल सलाहकार',
    'Irrigation': 'सिंचाई',
    'Weed ID': 'खरपतवार ID',
    'Assistant': 'सहायक',
    'About Us': 'हमारे बारे में',
    'Support': 'समर्थन',
    'Settings': 'सेटिंग्स',
    'Log Out': 'लॉग आउट'
  },
  ml: {
    'Dashboard': 'ഡാഷ്ബോർഡ്',
    'Analytics': 'അനലിറ്റിക്സ്',
    'Diagnostics': 'ഡയഗ്നോസ്റ്റിക്സ്',
    'Soil Analysis': 'മണ്ണ് വിശകലനം',
    'Pest Prediction': 'കീട പ്രവചനം',
    'Health Map': 'ഹെൽത്ത് മാപ്പ്',
    'Market': 'വിപണി',
    'Crop Advisor': 'വിള ഉപദേശകൻ',
    'Irrigation': 'ജലസേചനം',
    'Weed ID': 'കള ഐഡി',
    'Assistant': 'അസിസ്റ്റന്റ്',
    'About Us': 'ഞങ്ങളെക്കുറിച്ച്',
    'Support': 'പിന്തുണ',
    'Settings': 'ക്രമീകരണങ്ങൾ',
    'Log Out': 'ലോഗ് ഔട്ട്'
  },
  desi: {
    'Dashboard': 'Kheti Dashboard (घर)',
    'Analytics': 'Kheti Hisab (एनालिटिक्स)',
    'Diagnostics': 'Bimari Check (जांच)',
    'Soil Analysis': 'Mitti Janch (मृदा)',
    'Pest Prediction': 'Keeda Alert (कीड़ा)',
    'Health Map': 'Fasal Map (नक्शा)',
    'Market': 'Mandi Bhav (बाजार)',
    'Crop Advisor': 'Kheti Salah (सलाहकार)',
    'Irrigation': 'Pani Schedule (सिंचाई)',
    'Weed ID': 'Kachra ID (खरपतवार)',
    'Assistant': 'AI Kisan Dost (सहायक)',
    'About Us': 'Hamare Bare Me',
    'Support': 'Help & Support',
    'Settings': 'Settings (बदलाव)',
    'Log Out': 'Bahar Nikle (Logout)'
  },
};

// Create the context
type LanguageContextType = {
  locale: string;
  setLocale: (locale: string) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Create the provider component
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocale] = useState('en');

  const t = (key: string) => {
    return translations[locale]?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// Create a custom hook to use the context
export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

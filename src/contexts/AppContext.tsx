import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type LifeStage = "pregnant" | "postpartum" | "childcare" | null;

interface UserProfile {
  name: string;
  lifeStage: LifeStage;
  dueDate?: string;
  childBirthDate?: string;
  onboardingComplete: boolean;
}

interface AppContextType {
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  resetProfile: () => void;
}

const defaultProfile: UserProfile = {
  name: "",
  lifeStage: null,
  onboardingComplete: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile>(() => {
    const stored = localStorage.getItem("peribloom_profile");
    return stored ? JSON.parse(stored) : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem("peribloom_profile", JSON.stringify(profile));
  }, [profile]);

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const resetProfile = () => {
    setProfile(defaultProfile);
    localStorage.removeItem("peribloom_profile");
  };

  return (
    <AppContext.Provider
      value={{ profile, updateProfile, resetProfile }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

"use client";

import React, { createContext, useState, useContext, ReactNode } from "react";

// Define the shape of the context data
interface UserContextType {
  phoneNumber: string | null;
  userId: string | null;
  setPhoneNumber: (phoneNumber: string) => void;
  setUserId: (userId: string) => void;
}

// Default values for the context (can be null or default values)
const defaultUserContext: UserContextType = {
  phoneNumber: null,
  userId: null,
  setPhoneNumber: () => {},
  setUserId: () => {},
};

// Create the context
const UserContext = createContext<UserContextType>(defaultUserContext);

// Create a provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [phoneNumber, setPhoneNumber] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  return (
    <UserContext.Provider
      value={{
        phoneNumber,
        userId,
        setPhoneNumber,
        setUserId,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUserContext = () => {
  return useContext(UserContext);
};

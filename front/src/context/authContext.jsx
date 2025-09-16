import { createContext, useContext, useState } from "react";
import userService from "../service/userservice";

export const authContext = createContext();
authContext.displayName = "Auth";
export function AuthProvider({ children }) {
  const [user, setUser] = useState(userService.getUser());
  console.log("User from token:", user);
  const refreshUser = () => setUser(userService.getUser());
  const login = async (credentials) => {
    const response = await userService.login(credentials);
    refreshUser();
    return response;
  };
  const logout = () => {
    userService.logout();
    refreshUser();
  };
  return (
    <authContext.Provider
      value={{
        user,
        createUser: userService.createUser,
        login,
        logout,
      }}
    >
      {children}
    </authContext.Provider>
  );
}
export function useAuth() {
  return useContext(authContext);
}

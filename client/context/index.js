import { useState, createContext, useEffect } from "react";

const UserContext = createContext();

function UserProvider({ children }) {
  const [state, setState] = useState({
    user: {},
    token: "",
  });

  useEffect(() => {
    setState(JSON.parse(window.localStorage.getItem("auth")));
  }, []);
  return (
    <UserContext.Provider value={{ state, setState }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };

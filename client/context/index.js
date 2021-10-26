import router from "next/router";
import { useState, createContext, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

function UserProvider({ children }) {
  const [state, setState] = useState({
    user: {},
    token: "",
  });

  useEffect(() => {
    setState(JSON.parse(window.localStorage.getItem("auth")));
  }, []);

  // axios configuration
  const token = state && state.token ? state.token : "";
  axios.defaults.baseURL = process.env.NEXT_PUBLIC_API;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  // axios interceptors for token expiration
  axios.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      const res = error.response;
      if (res.status === 401 && res.config && !res.config.__isRetryRequest) {
        setState(null);
        window.localStorage.removeItem("auth");
        router.push("/login");
      }
      return Promise.reject(error);
    }
  );
  return (
    <UserContext.Provider value={{ state, setState }}>
      {children}
    </UserContext.Provider>
  );
}

export { UserProvider, UserContext };

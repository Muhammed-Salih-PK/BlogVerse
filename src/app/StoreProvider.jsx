"use client";

import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { makeStore } from "../lib/store";
import { setUser } from "../lib/features/auth/authSlice";
import { genericFetchData } from "@/lib/genericFetchData";

export default function StoreProvider({ children }) {
  const storeRef = useRef();

  if (!storeRef.current) {
    storeRef.current = makeStore(); 
  }

  useEffect(() => {
    async function fetchUser() {
      const [data, error] = await genericFetchData(`/api/profile`);
      if (data?.user) {
        storeRef.current.dispatch(setUser(data.user)); 
      }
    }

    fetchUser();
  }, []);

  return <Provider store={storeRef.current}>{children}</Provider>;
}

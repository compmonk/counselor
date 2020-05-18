import React from "react";

export const AuthContext = React.createContext({
    currentUser:{},
    setUser:() => {},
    isUserLoading:false,
    setIsUserLoading:() => {},
    cookies:"",
    setCookies:() => {},
}) ;
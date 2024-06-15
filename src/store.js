"use client"

import { createContext, useReducer } from "react";

const initialState = {
    auth : false
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        const { type, payload } = action;
        
        switch(type) {
            case "Authorized" :
                return {
                    ...state,
                    auth : payload.auth
                };
            case "UnAuthorized" :
                return {
                        ...state,
                    auth : payload.auth
                };
            default :
                throw new Error()
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
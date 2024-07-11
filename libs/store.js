"use client"

import { createContext, useReducer } from "react";

const initialState = {
    auth: null
};

const store = createContext(initialState);
const { Provider } = store;

const StateProvider = ({ children }) => {
    const [state, dispatch] = useReducer((state, action) => {
        const { type, payload } = action;
        
        switch(type) {
            case "SET_AUTH" :
                return {
                    ...state,
                    auth: payload.auth
                };
            default :
                throw new Error()
        };
    }, initialState);

    return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

export { store, StateProvider };
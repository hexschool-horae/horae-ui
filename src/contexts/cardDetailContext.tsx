import { ReactNode, createContext, useContext, useReducer } from "react";
import { IInitialState, initialState, cardDetailReducer } from "./reducers/cardDetailReducer"

type TCardDetailProviderProps = {
    children: ReactNode
}



const CardDetailContext = createContext<{
    state: IInitialState,
    dispatch: React.Dispatch<any>
}>({
    state: initialState,
    dispatch: () => {}
});

export function useCardDetail() {
    return useContext(CardDetailContext)
}

export function CardDetailProvider({ children }: TCardDetailProviderProps) {

    const [state, dispatch] = useReducer(cardDetailReducer, initialState)

    return (
        <CardDetailContext.Provider value={{state, dispatch}}>
            {children}
            {/* 所有popup */}
        </CardDetailContext.Provider>
    )
}
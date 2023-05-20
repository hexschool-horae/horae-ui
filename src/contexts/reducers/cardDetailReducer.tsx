interface IPopups {
    memberPopups: boolean
}

interface ICardDetail {
    title: string,
}

export interface IInitialState {
    initialized: boolean,
    popups: IPopups,
    cardDetail: ICardDetail,
}


export const initialState = {
    initialized: false,
    popups: {
        memberPopups: false,
    },
    // from API
    cardDetail: {
        title: ""
    }
}

const enum REDUCER_ACTION_TYPE {
    INITIALIZE_CARD = "INITIALIZE_CARD",
    TOTGGLE_POPUP = "TOTGGLE_POPUP",
    EDIT_TITLE = "EDIT_TITLE",
}

type TReducerAction = {
    type: REDUCER_ACTION_TYPE,
    payload?: any
}

export function cardDetailReducer(state: IInitialState, action: TReducerAction) {
    console.log(state, action)
 
    switch(action.type) {
        case REDUCER_ACTION_TYPE.INITIALIZE_CARD:
            return {
                ...state,
                cardDetail: action.payload.cardDetail,
                initialized: true,
            }
        case REDUCER_ACTION_TYPE.EDIT_TITLE:
            return {
                ...state,
                cardDetail: {
                    title: action.payload.cardDetail.title,
                },
                initialized: false,
            }

            
        case REDUCER_ACTION_TYPE.TOTGGLE_POPUP:
            return {...state}
    
        default:
            return state;
    }
}
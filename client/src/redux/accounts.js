import * as ActionTypes from './ActionTypes';

export const Accounts = (state = {
        isLoading: false ,
        errMess: null,
        accounts: []
    }, action) => {
    switch(action.type) {
        case ActionTypes.ADD_ACCOUNTS:
            return {...state, isLoading: false, errMess: null, accounts: action.payload};

        case ActionTypes.ACCOUNTS_LOADING:
            return {...state, isLoading: true, errMess: null, accounts: []};

        case ActionTypes.ACCOUNTS_FAILED:
            return {...state, isLoading: false, errMess: action.payload, accounts: []};


        default:
            return state;
    }
}
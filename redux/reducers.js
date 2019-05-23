import { combineReducers } from "redux";

const initialWalletState = {
    wallet: undefined,
    encryptedWallet: '',
};

function walletReducer(state = initialWalletState, action) {
    switch(action.type) {
        case 'setWallet': {
            return {
                ...state,
                wallet: action.wallet,
            };
        }
        case 'setEncryptedWallet': {
            return {
                ...state,
                encryptedWallet: action.encryptedWallet,
            }
        }
        default: {
            return state;
        }
    }
}

export default combineReducers({ walletReducer });

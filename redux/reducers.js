import { combineReducers } from "redux";

const initialWalletState = {
    wallet: undefined,
    encryptedWallet: '',
    status: 'Idle',
    walletStatus: 'Idle',
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
        case 'statusSaving': {
            return {
                ...state,
                status: 'Saving',
            }
        }
        case 'statusLoading': {
            return {
                ...state,
                status: 'Loading',
            }
        }
        case 'statusReduxing': {
            return {
                ...state,
                status: 'Reduxing',
            }
        }
        case 'statusIdle': {
            return {
                ...state,
                status: 'Idle',
            }
        }
        case 'walletIdle': {
            return {
                ...state,
                walletStatus: 'Idle',
            }
        }
        case 'walletLoading': {
            return {
                ...state,
                walletStatus: 'Loading',
            }
        }
        default: {
            return state;
        }
    }
}

export default combineReducers({ walletReducer });

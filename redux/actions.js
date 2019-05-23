//import { bindActionCreators } from "redux";

function setWalletAction(wallet) {
    return {
        type: 'setWallet',
        wallet,
    }
}

function setEncryptedWalletAction(encryptedWallet) {
    return {
        type: 'setEncryptedWallet',
        encryptedWallet,
    }
}

function statusSavingAction() {
    return {
        type: 'statusSaving',
    }
}
function statusLoadingAction() {
    return {
        type: 'statusLoading',
    }
}
function statusReduxingAction() {
    return {
        type: 'statusReduxing',
    }
}
function statusIdleAction() {
    return {
        type: 'statusIdle',
    }
}

function walletIdleAction() {
    return {
        type: 'walletIdle',
    }
}
function walletLoadingAction() {
    return {
        type: 'walletLoading',
    }
}

export {
    setWalletAction,
    setEncryptedWalletAction,
    statusSavingAction,
    statusLoadingAction,
    statusReduxingAction,
    statusIdleAction,
    walletLoadingAction,
    walletIdleAction,
}

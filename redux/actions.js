//import { bindActionCreators } from "redux";

function setWalletAction(wallet) {
    return {
        type: 'setWallet',
        wallet,
    }
}

function setPrivateKeyAction(privateKey) {
    return {
        type: 'setPrivateKey',
        privateKey,
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
    setPrivateKeyAction,
    statusSavingAction,
    statusLoadingAction,
    statusReduxingAction,
    statusIdleAction,
    walletLoadingAction,
    walletIdleAction,
}

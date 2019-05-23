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

export {
    setWalletAction,
    setEncryptedWalletAction
}

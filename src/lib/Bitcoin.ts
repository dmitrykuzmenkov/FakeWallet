const bitcoin = require('bitcoinjs-lib');

export default {
  getBTCAddress: (secretKey: string, path: string): string => {
    if (!secretKey) {
      return '';
    }
    let root = bitcoin.bip32.fromSeed(Buffer.from(secretKey, 'hex'));
    const node = root.derivePath(path);
    return bitcoin.payments.p2pkh({ pubkey: node.publicKey }).address;
  }
};
import React, { useState } from 'react';
import { IonContent, IonModal, IonButton } from '@ionic/react';
import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;
const bip39 = require('bip39');
async function getSecretKey() {
  const { value } =  await Storage.get({key: 'secretKey'});
  return value;
}

const SeedContainer: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  getSecretKey().then((s) => setIsActive(!s));
  if (!isActive) {
    return null;
  }

  const mnemonic = bip39.generateMnemonic(256);
  let secretKey = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
  async function saveSecretKey() {
    await Storage.set({key: 'secretKey', value: secretKey});
    setIsActive(false)
  }
  return (
    <IonContent>
      <IonModal isOpen={isActive}>
        <p>Your mnemonic: <strong>{mnemonic}</strong></p>
        <p>Your secret key: {secretKey}</p>
        <p>Please save it and confirm saving by pressing the button.</p>
        <p>I have saved all information and ready to confirm that I will never ever see this again.</p>
        <IonButton onClick={saveSecretKey}>Confirm</IonButton>
      </IonModal>
    </IonContent>
  );
};

export default SeedContainer;

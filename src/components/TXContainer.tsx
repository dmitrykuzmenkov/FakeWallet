import React, { useState } from 'react';
import { IonContent, IonCard, IonButton } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import Bitcoin from '../lib/Bitcoin';
const { Storage } = Plugins;

interface ContainerProps {
  name: string;
  address?: string;
}

const TXContainer: React.FC<ContainerProps> = ({ name, address }) => {
  let [txs, setTxs] = useState([]);
  let [error, setError] = useState('');
  let [index, setIndex] = useState<number>(0);

  Storage.get({key: 'pathIndex'}).then(i => setIndex(parseInt(`${i.value}`, 10)));
  Storage.get({key: 'secretKey'}).then(s => {
    if (!s.value || txs.length > 0) {
      return null
    }
    let request = [];
    if (address) {
      request.push(address);
    } else {
      for (let k = 0; k < index; ++k) {
        request.push(Bitcoin.getBTCAddress(s.value, "m/0'/0/" + k))
      }
    }

    fetch('http://127.0.0.1/tx', {
      method: 'POST',
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({addresses: request})
    })
      .then(res => res.json())
      .then(
        (result) => {
          setTxs(result)
        },
        (error) => {
          setError(error)
        }
      )
    ;
  })


  return (
    <IonContent>
      <strong>[{txs.length}] Transactions{address ? ": " + address : ''}</strong>
      {error ? (
        <div>
          <p>Error occurred during the request to the server:</p>
          <p>{error}</p>
        </div>
      ) : ''}
      {txs.map(item => {
        return (
          <IonCard>
            <p><strong>{item['tx']}</strong></p>
            <p>Address: {item['address']}</p>
            <p>Amount: {item['amount']} BTC</p>
            <p>Date: {item['created_at']}</p>
          </IonCard>
        )
      })}
    </IonContent>
  );
};

export default TXContainer;

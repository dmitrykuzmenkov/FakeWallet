import React, { useState } from 'react';
import { IonContent, IonCard, IonButton } from '@ionic/react';
import { Plugins } from '@capacitor/core';
import Bitcoin from '../lib/Bitcoin';
const { Storage } = Plugins;
interface ContainerProps {
  name: string;
}

const AddressContainer: React.FC<ContainerProps> = ({ name }) => {
  let [addresses, setAddresses] = useState<any>([]);
  const [secretKey, setSecretKey] = useState<string>('');
  let [index, setIndex] = useState<number>(10);


  function generateAddress() {
    addresses = [
      ...addresses,
      {address: Bitcoin.getBTCAddress(secretKey, "m/0'/0/" + index), balance: 0}
    ];
    Storage.set({key: 'pathIndex', value: (index + 1).toString()})
    setIndex(index + 1)
    setAddresses(addresses);
  }

  Storage.get({key: 'pathIndex'}).then(i => setIndex(parseInt(`${i.value}`, 10)));
  Storage.get({key: 'secretKey'}).then(s => {
    // Generate first 10 addresses
    if (s.value) {
      setSecretKey(s.value);
    }
    if (!s.value || addresses.length > 0) {
      return null
    }
    let addrs = [];
    let request = [];
    for (let k = 0; k < index; ++k) {
      const addr = Bitcoin.getBTCAddress(secretKey, "m/0'/0/" + k);
      request.push(addr)
      addrs.push({
        address: addr,
        balance: 0
      });
    }

    // setAddresses(addrs);
    fetch('http://127.0.0.1/balance', {
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
          console.log(result.length)
          setAddresses(result)
        },
        (error) => {
          alert(error)
        }
      )
    ;
  })

  return (
    <IonContent>
      <strong>Your addresses</strong>
      {addresses.map((addr:any) => {
        const route = "/page/TX/" + addr.address;
        return (
          <IonCard routerLink={route}>
            <strong>{addr.address}</strong>
            <p>Balance: {addr.balance} BTC</p>
          </IonCard>
        );
      })}
      <IonCard>
        <IonButton onClick={generateAddress}>New address</IonButton>
      </IonCard>
      <br/><br/>
    </IonContent>
  );
};

export default AddressContainer;

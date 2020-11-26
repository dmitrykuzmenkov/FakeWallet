import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import React from 'react';
import { useParams } from 'react-router';
import SeedContainer from '../components/SeedContainer'
import AddressContainer from '../components/AddressContainer'
import TXContainer from '../components/TXContainer'
import './Page.css';

const Page: React.FC = () => {

  const { name, address } = useParams<{ name: string; address?: string; }>();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{name}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <SeedContainer />
        { name === 'Address' ? <AddressContainer name={name} /> : '' }
        { name === 'TX' ? <TXContainer name={name} address={address} /> : '' }
      </IonContent>
    </IonPage>
  );
};

export default Page;

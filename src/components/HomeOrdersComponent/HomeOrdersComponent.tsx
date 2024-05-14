import React, { useEffect, useState } from "react";
import { writeBatch, doc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";

type AssortmentTypes =
  | "assoTypeA"
  | "assoTypeB"
  | "assoTypeC"
  | "assoTypeD"
  | "assoTypeE"
  | "assoTypeF";

type OrdersData = {
  id: string;
  assoType: AssortmentTypes;
  timeFrames: [Date, Date];
  deliveryTime: number;
  pickUpTime: number;
  deliveryType: string;
};

type ConfirmedOrders = {
  id: string | null;
  confirmed: boolean;
};

type OrdersPersonalDetails = {
  id: string | null;
  addressZipCode: string;
  addressCity: string;
  addressStreet: string;
  addressHouseNumber: string;
  clientName: string;
  clientSurname: string;
  phoneNr: string;
  paymentType: string | null;
};

const HomeOrdersComponet: React.FC = () => {
  const [ordersData, setOrdersData] = useState<OrdersData[]>([]);
  const [confirmedOrders, setConfirmedOrders] = useState<ConfirmedOrders[]>([]);

  useEffect(() => {
    const ordersCollection = collection(firestore, "orders");
    const promiseOrdersCollection = getDocs(ordersCollection);

    const confirmedOrdersCollection = collection(firestore, "confirmedOrders");
    const promiseConfirmedOrdersCollection = getDocs(confirmedOrdersCollection);

    const ordersPersonalDetails = collection(
      firestore,
      "ordersPersonalDetails"
    );
    const promiseOrdersPersonalDetails = getDocs(ordersPersonalDetails);

    Promise.all([
      promiseOrdersCollection,
      promiseConfirmedOrdersCollection,
      promiseOrdersPersonalDetails,
    ]).then((promisesResults) => {
      const snapshot1 = promisesResults[0];
      const snapshot2 = promisesResults[1];
      const snapshot3 = promisesResults[2];

      const ordersData = snapshot1.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as OrdersData;
      });

      const confirmedOrdersData = snapshot2.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as ConfirmedOrders;
      });

      const ordersDetailsData = snapshot3.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as OrdersPersonalDetails;
      });

      setOrdersData(ordersData);
      setConfirmedOrders(confirmedOrdersData);
    });
  }, []);

  return (
    <div>
      {ordersData.map((order) => (
        <div key={order.id}>
          {order.deliveryType}
        </div>
      ))}
    </div>
  );
};

export default HomeOrdersComponet;

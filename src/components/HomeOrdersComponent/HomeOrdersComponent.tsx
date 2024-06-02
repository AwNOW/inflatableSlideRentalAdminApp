import "./homeOrdersComponent.css";
import React, { useEffect, useState } from "react";
import { writeBatch, doc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import OrderDetailsComponet from "../OrderDetailsComponent/OrderDetailsComponet";

type AssortmentTypes =
  | "assoTypeA"
  | "assoTypeB"
  | "assoTypeC"
  | "assoTypeD"
  | "assoTypeE"
  | "assoTypeF";

const assortmentTypes = {};

interface OrdersData {
  id: string;
  assoType: AssortmentTypes;
  timeFrames: { seconds: number; nanoseconds: number }[];
  deliveryTime: number;
  pickUpTime: number;
  deliveryType: string;
  currentDate: { seconds: number; nanoseconds: number };
}

interface ConfirmedOrders {
  id: string;
  adminConfirmation: boolean;
}

interface OrdersPersonalDetails {
  id: string;
  addressZipCode: string;
  addressCity: string;
  addressStreet: string;
  addressHouseNumber: string;
  clientName: string;
  clientSurname: string;
  phoneNr: string;
  email: string;
}

export interface FullOrder {
  id: string;
  addressZipCode: string;
  addressCity: string;
  addressStreet: string;
  addressHouseNumber: string;
  clientName: string;
  clientSurname: string;
  phoneNr: string;
  email: string;
  assoType: AssortmentTypes;
  timeFrames: { seconds: number; nanoseconds: number }[];
  deliveryTime: number;
  pickUpTime: number;
  deliveryType: string;
  adminConfirmation: boolean | undefined;
}

const HomeOrdersComponent: React.FC = () => {
  const [ordersData, setOrdersData] = useState<OrdersData[]>([]);
  const [ordersPersonalData, setOrdersPersonalData] = useState<
    OrdersPersonalDetails[]
  >([]);
  const [confirmedOrders, setConfirmedOrders] = useState<ConfirmedOrders[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fullOrder, setFullOrder] = useState<FullOrder | undefined>();

  useEffect(() => {
    if (fullOrder !== undefined) return;
    const ordersCollection = collection(firestore, "orders");
    const promiseOrdersCollection = getDocs(ordersCollection);

    const confirmedOrdersCollection = collection(firestore, "confirmedOrders");
    const promiseConfirmedOrdersCollection = getDocs(confirmedOrdersCollection);

    const ordersPersonalDetails = collection(
      firestore,
      "ordersPersonalDetails"
    );
    const promiseOrdersPersonalDetails = getDocs(ordersPersonalDetails);
    setIsLoading(true);
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
        console.log(data);
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

      const ordersPersonalData = snapshot3.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as OrdersPersonalDetails;
      });
      setOrdersData(ordersData);
      setConfirmedOrders(confirmedOrdersData);
      setOrdersPersonalData(ordersPersonalData);
      setIsLoading(false);
    });
  }, [fullOrder]);

  // formatDate

  // Polish days of the week
  const polishDays: string[] = ["nd", "pon", "wt", "śr", "czw", "pt", "sb"];

  const getFormattedDate = (timestamp: number) => {
    const dateObject: Date = new Date(timestamp);

    // // Format the date
    const formattedDate: string = `${("0" + dateObject.getDate()).slice(-2)}.${(
      "0" +
      (dateObject.getMonth() + 1)
    ).slice(-2)}.${dateObject.getFullYear()}`;

    // // Get the Polish name for the day of the week
    const dayOfWeek: string = polishDays[dateObject.getDay()];

    const formattedDateWithDay: string = `${formattedDate} (${dayOfWeek})`;

    return formattedDateWithDay;
  };

  //format Hours
  const getHourFromTimestamp = (timestamp: number): string => {
    const dateObject: Date = new Date(timestamp);
    const formattedTime: string = `${("0" + dateObject.getHours()).slice(
      -2
    )}:${("0" + dateObject.getMinutes()).slice(-2)}`;

    return formattedTime;
  };

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "currentDate", headerName: "Data zgłoszenia", width: 150 },
    {
      field: "startDate",
      headerName: "Początek rezerwacji",
      type: "string",
      width: 150,
      editable: false,
    },
    {
      field: "endDate",
      headerName: "Koniec rezerwacji",
      type: "string",
      width: 150,
      editable: false,
    },
    {
      field: "deliveryTime",
      headerName: "Godzina odbioru/dostawy",
      type: "string",
      width: 200,
      editable: false,
    },
    {
      field: "pickUpTime",
      headerName: "Godzina zwrotu/odbioru",
      type: "string",
      width: 200,
      editable: false,
    },
    {
      field: "assoType",
      headerName: "Rodzaj asso",
      type: "string",
      width: 110,
      editable: false,
    },

    {
      field: "adminConfirmation",
      headerName: "Zatwierdzone zamówienie",
      type: "boolean",
      width: 90,
      editable: false,
    },
  ];
  const rows = ordersData.map((order) => {
    console.log(order);
    const adminOrderConfirmation = confirmedOrders.find(
      (confirmation) => confirmation.id === order.id
    );

    return {
      id: order.id,
      currentDate: getFormattedDate(order.currentDate.seconds * 1000),
      startDate: getFormattedDate(order.timeFrames[0].seconds * 1000),
      endDate: getFormattedDate(order.timeFrames[1].seconds * 1000),
      deliveryTime: getHourFromTimestamp(order.deliveryTime),
      pickUpTime: getHourFromTimestamp(order.pickUpTime),
      assoType: order.assoType,
      adminConfirmation: adminOrderConfirmation
        ? adminOrderConfirmation.adminConfirmation
        : false,
    };
  });

  const orderForm = (id: string) => {
    const generalInformation = ordersData.find((general) => general.id === id);
    if (!generalInformation) {
      throw new Error("missing generalData");
    }
    const personalInformation = ordersPersonalData.find(
      (personal) => personal.id === id
    );
    if (!personalInformation) {
      throw new Error("missing personalData");
    }

    const adminConfirmation = confirmedOrders.find(
      (confirmation) => confirmation.id === id
    );

    setFullOrder({
      id: personalInformation.id,
      addressZipCode: personalInformation.addressZipCode,
      addressCity: personalInformation.addressCity,
      addressStreet: personalInformation.addressStreet,
      addressHouseNumber: personalInformation.addressHouseNumber,
      clientName: personalInformation.clientName,
      clientSurname: personalInformation.clientSurname,
      phoneNr: personalInformation.phoneNr,
      email: personalInformation.email,
      assoType: generalInformation.assoType,
      timeFrames: generalInformation.timeFrames,
      deliveryTime: generalInformation.deliveryTime,
      pickUpTime: generalInformation.pickUpTime,
      deliveryType: generalInformation.deliveryType,
      adminConfirmation: adminConfirmation
        ? adminConfirmation.adminConfirmation
        : false,
    });
  };

  return (
    <div className="table-container">
      {isLoading && <div>Loading...</div>}
      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          onRowClick={(row: any) => {
            orderForm(row.id);
          }}
        />
      </Box>
      {fullOrder && (
        <OrderDetailsComponet
          setFullOrder={setFullOrder}
          orderDetails={fullOrder}
        />
      )}
    </div>
  );
};

export default HomeOrdersComponent;

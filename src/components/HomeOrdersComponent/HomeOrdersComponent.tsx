import React, { useEffect, useState } from "react";
import { writeBatch, doc, collection, getDocs } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// const rows = [
//   {
//     id: 1,
//     startDate: "07.05.2024 wtorek",
//     endDate: "08.05.2024 śr",
//     deliveryTime: "14:00",
//     pickUpTime: "15:00",
//     assoType: "Zamek A",
//     IsConfirmed: true,
//   },
//   {
//     id: 2,
//     startDate: "07.05.2024 wtorek",
//     endDate: "08.05.2024 śr",
//     deliveryTime: "14:00",
//     pickUpTime: "15:00",
//     assoType: "Zamek A",
//     IsConfirmed: true,
//   },
//   {
//     id: 3,
//     startDate: "07.05.2024 wtorek",
//     endDate: "08.05.2024 śr",
//     deliveryTime: "14:00",
//     pickUpTime: "15:00",
//     assoType: "Zamek A",
//     IsConfirmed: true,
//   },
//   {
//     id: 4,
//     startDate: "07.05.2024 wtorek",
//     endDate: "08.05.2024 śr",
//     deliveryTime: "14:00",
//     pickUpTime: "15:00",
//     assoType: "Zamek A",
//     IsConfirmed: true,
//   },
//   {
//     id: 5,
//     startDate: "07.05.2024 wtorek",
//     endDate: "08.05.2024 śr",
//     deliveryTime: "14:00",
//     pickUpTime: "15:00",
//     assoType: "Zamek A",
//     IsConfirmed: true,
//   },
// ];

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
  timeFrames: { seconds: number; nanoseconds: number }[];
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
      editable: true,
    },

    {
      field: "IsConfirmed",
      headerName: "Zatwierdzone zamówienie",
      type: "boolean",
      width: 200,
      editable: true,
    },
  ];
  const rows = ordersData.map((order) => {
    return {
      id: order.id,
      startDate: getFormattedDate(order.timeFrames[0].seconds * 1000),
      endDate: getFormattedDate(order.timeFrames[1].seconds * 1000),
      deliveryTime: getHourFromTimestamp(order.deliveryTime),
      pickUpTime: getHourFromTimestamp(order.pickUpTime),
      assoType: order.assoType,
      IsConfirmed: true,
    };
  });

  return (
    <div>
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
          onCellClick={() => console.log()}
          // checkboxSelection
          // disableRowSelectionOnClick={false}
        />
      </Box>
    </div>
  );
};

export default HomeOrdersComponet;

import styled from "styled-components";
import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { ordersEdit, ordersFetch } from "../../../features/OrdersSlice";
import moment from "moment";
import { useNavigate } from "react-router-dom";

export default function OrdersList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list } = useSelector((state) => state.orders); //from here I retrieve the items

  useEffect(() => {
    dispatch(ordersFetch());
  }, [dispatch]);

  const rows =
    list &&
    list.map((order) => {
      return {
        id: order._id,
        cName: order.shipping.name,
        amount: (order.total / 100)?.toLocaleString(),
        deliveryStatus: order.delivery_status,
        date: moment(order.createdAt).fromNow(),
      };
    });
  const columns = [
    { field: "id", headerName: "ID", width: 220 },
    {
      field: "cName",
      headerName: "Image",
      width: 100,
    },
    { field: "amount", headerName: "Amount($)", width: 130 },
    {
      field: "deliveryStatus",
      headerName: "Delivery Status",
      width: 150,
      renderCell: (params) => {
        return (
          <div>
            {params.row.deliveryStatus === "pending" ? (
              <Pending>Pending</Pending>
            ) : params.row.deliveryStatus === "dispatched" ? (
              <Dispatched>Dispatched</Dispatched>
            ) : params.row.deliveryStatus === "delivered" ? (
              <Delivered>Delivered</Delivered>
            ) : (
              "Error"
            )}
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 120,
    },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      width: 220,
      renderCell: (params) => {
        return (
          <Actions>
            <DispatchButton onClick={() => handleOrderDispatch(params.row.id)}>
              Dispatch
            </DispatchButton>
            <DeliveryButton onClick={() => handleOrderDelivered(params.row.id)}>Delivery</DeliveryButton>
            <View onClick={() => navigate(`/order/${params.row.id}`)}>View</View>
          </Actions>
        );
      },
    },
  ];
  const handleOrderDispatch = (id) => {
    dispatch(
      ordersEdit({
        id,
        delivery_status: "dispatched",
      })
    );
  };
  const handleOrderDelivered = (id) => {
    dispatch(
      ordersEdit({
        id,
        delivery_status: "delivered",
      })
    );
  };

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  );
}

const DispatchButton = styled.button`
  background-color: rgb(38 198 249);
`;
const DeliveryButton = styled.button`
  background-color: rgb(102 108 255);
`;
const View = styled.button`
  background-color: rgb(114 225 40);
`;
const Actions = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  button {
    border: none;
    outline: none;
    padding: 3px 5px;
    color: #fff;
    border-radius: 3px;
    cursor: pointer;
  }
`;
const Pending = styled.div`
  color: rgb(255 181 40);
  background-color: rgba(253, 181, 40, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;
const Dispatched = styled.div`
  color: rgb(38 198 249);
  background-color: rgba(38, 198, 249, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;
const Delivered = styled.div`
  color: rgb(102 108 255);
  background-color: rgba(102, 108, 255, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

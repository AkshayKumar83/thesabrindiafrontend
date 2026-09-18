import { request } from "./api.js";

export const createOrderApi = async (data) => {
  return request({
    method: "post",
    url: "/orders",
    data,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

export const getOrderByIdApi = async (id, orderNo) => {
  return request({
    method: "get",
    url: `/orders/order/${id}/${orderNo}`,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};
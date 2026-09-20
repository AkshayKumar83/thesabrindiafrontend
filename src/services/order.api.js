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

export const getOrdersApi = async (data) => {
  return request({
    method: "get",
    url: "/orders/users",
    data,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

export const getAllOrdersListApi = async () => {
  return request({
    method: "get",
    url: "/orders/list",
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

export const getProductByCategoryApi = async (categoryName) => {
  return request({
    method: "get",
    url: `/products/category-collections?category=${categoryName}`,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};
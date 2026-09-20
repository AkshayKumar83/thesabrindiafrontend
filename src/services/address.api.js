import { request } from "./api.js";

// GET /api/address
export const getAddressesApi = async () => {
  return request({
    method: "get",
    url: "/address",
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

// GET /api/address/:id
export const getAddressByIdApi = async (id) => {
  return request({
    method: "get",
    url: `/address/${id}`,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

// POST /api/address
export const createAddressApi = async (data) => {
  return request({
    method: "post",
    url: "/address",
    data,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

// PATCH /api/address/:id
export const updateAddressApi = async (id, data) => {
  return request({
    method: "patch",
    url: `/address/${id}`,
    data,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

// PATCH /api/address/:id/default
export const setDefaultAddressApi = async (id) => {
  return request({
    method: "patch",
    url: `/address/${id}/default`,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

// DELETE /api/address/:id
export const deleteAddressApi = async (id) => {
  return request({
    method: "delete",
    url: `/address/${id}`,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

export const getLocationsApi  = async () => {
  return request({
    method: "get",
    url: `/locations`,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};
import { request } from "./api.js";

// GET /api/address
export const getUpdateProfileApi = async (data) => {
  return request({
    method: "put",
    url: `/profile/profile`,
    data,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

// GET /api/address/:id
export const getProfileByUserIdApi = async () => {
  return request({
    method: "get",
    url: `/profile`,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};




// PUT /api/address/:id
export const updateUserPasswordApi = async ( data) => {
  return request({
    method: "put",
    url: `/profile/password`,
    data,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};




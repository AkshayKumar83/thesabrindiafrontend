import { request } from "./api.js";

// ==========================================
// GET CART
// ==========================================

export const getCartApi = async () => {
  return request({
    method: "get",
    url: "/cart",
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

// ==========================================
// ADD TO CART
// ==========================================

export const addToCartApi = async ({
  productId,
  variantId,
  quantity = 1,
}) => {
  return request({
    method: "post",
    url: "/cart",
    data: {
      productId,
      variantId,
      quantity,
    },
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

// ==========================================
// UPDATE QUANTITY
// ==========================================

export const updateCartQuantityApi = async (
  variantId,
  quantity
) => {
  return request({
    method: "patch",
    url: `/cart/${variantId}`,
    data: {
      quantity,
    },
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

// ==========================================
// REMOVE ITEM
// ==========================================

export const removeFromCartApi = async (variantId) => {
  return request({
    method: "delete",
    url: `/cart/${variantId}`,
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

// ==========================================
// CLEAR CART
// ==========================================

export const clearCartApi = async () => {
  return request({
    method: "delete",
    url: "/cart",
    headers: {
      etoken: localStorage.getItem("etoken"),
    },
  });
};

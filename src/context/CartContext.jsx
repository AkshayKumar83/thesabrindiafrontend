import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";

import {
  getCartApi,
  addToCartApi,
  updateCartQuantityApi,
  removeFromCartApi,
  clearCartApi,
} from "../services/cart.api.js";

const CartContext = createContext(null);
const API_BASE_IMAGE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8090';

const initialState = {
  items: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case "LOAD_CART":
      return {
        ...state,
        items: action.payload || [],
      };

    case "SET_CART":
      return {
        ...state,
        items: action.payload || [],
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(
    cartReducer,
    initialState
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const getGuestCart = () => {
    try {
      const savedCart =
        localStorage.getItem("guestCart");

      if (!savedCart) {
        return [];
      }

      const parsedCart = JSON.parse(savedCart);

      return Array.isArray(parsedCart)
        ? parsedCart
        : [];
    } catch (error) {
      console.error(
        "Unable to read guest cart:",
        error
      );

      return [];
    }
  };

  const saveGuestCart = (items) => {
    localStorage.setItem(
      "guestCart",
      JSON.stringify(items)
    );
  };

  const clearGuestCart = () => {
    localStorage.removeItem("guestCart");
  };

  // ==========================================
  // LOAD CART
  // ==========================================

  const loadCart = async () => {
    const token = localStorage.getItem("etoken");

    // ------------------------------------------
    // GUEST
    // ------------------------------------------

    if (!token) {
      const guestCart = getGuestCart();

      dispatch({
        type: "SET_CART",
        payload: guestCart,
      });

      return;
    }

    // ------------------------------------------
    // LOGGED IN
    // ------------------------------------------

    try {
      setLoading(true);
      setError(null);
      const response = await getCartApi();
      const items = response?.data?.items?.map((item) => ({
                      ...item,
                      image: item?.variant?.images?.find(
                        (image) => Number(image.isPrimary) === 1
                      )
                        ? `${API_BASE_IMAGE_URL}${
                            item.variant.images.find(
                              (image) => Number(image.isPrimary) === 1
                            ).image_url
                          }`
                        : "",
                    }));
      dispatch({
        type: "LOAD_CART",
        payload: items || [],
      });
    } catch (error) {
      console.error(
        "Load cart error:",
        error
      );

      setError(error.message);

      dispatch({
        type: "SET_CART",
        payload: [],
      });
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // SYNC GUEST CART AFTER LOGIN
  // ==========================================

  const syncGuestCart = async () => {
    const token = localStorage.getItem("etoken");

    if (!token) {
      return;
    }

    const guestCart = getGuestCart();

    if (guestCart.length === 0) {
      await loadCart();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Add every guest item to user's DB cart
      for (const item of guestCart) {
        await addToCartApi({
          productId: item.productId,
          variantId: item.variantId,
          quantity: Number(
            item.quantity || 1
          ),
        });
      }

      // Guest cart successfully moved to DB
      clearGuestCart();

      // Load final merged DB cart
      await loadCart();
    } catch (error) {
      console.error(
        "Guest cart sync error:",
        error
      );

      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadCart();
  }, []);

  // ==========================================
  // ADD TO CART
  // ==========================================

  const addToCart = async (product) => {
    const token = localStorage.getItem("etoken");

    // ==========================================
    // GUEST
    // ==========================================

    if (!token) {
      const guestCart = getGuestCart();
      const productId =
        product.productId;

      const variantId =
        product.id;

      const existingItem =
        guestCart.find(
          (item) =>
            item.variantId === variantId
        );

      let updatedCart;

      // ----------------------------------------
      // ITEM ALREADY EXISTS
      // ----------------------------------------

      if (existingItem) {
        updatedCart = guestCart.map(
          (item) => {
            if (
              item.variantId !==
              variantId
            ) {
              return item;
            }

            const quantity =
              Number(item.quantity) + 1;

            return {
              ...item,

              quantity,

              totalPrice:
                Number(
                  item.variant?.price || 0
                ) * quantity,

              updatedAt:
                new Date().toISOString(),
            };
          }
        );
      }

      // ----------------------------------------
      // NEW ITEM
      // ----------------------------------------

      else {
        const quantity = 1;

        const newCartItem = {
          // Same structure as API
          id: null,

          userId: null,

          productId,

          variantId,

          image:product.image,

          quantity,

          totalPrice:
            Number(product.price) *
            quantity,

          createdAt: null,

          updatedAt:
            new Date().toISOString(),

          // Product object
          product: product.product,

          // Variant object
          variant: {
            id: product.id,

            productId:
              product.productId,

            name: product.name,

            color: product.color,

            price:
              String(product.price),

            inStock:
              Number(
                product.inStock || 0
              ),

            description:
              product.description,

            isPrimary:
              product.isPrimary,

            images:
              product.images || [],

            createdAt:
              product.createdAt,

            updatedAt:
              product.updatedAt,
          },
        };

        updatedCart = [
          ...guestCart,
          newCartItem,
        ];
      }

      saveGuestCart(updatedCart);

      dispatch({
        type: "SET_CART",
        payload: updatedCart,
      });

      return;
    }

    // ==========================================
    // LOGGED IN
    // ==========================================

    try {
      setError(null);

      const response =
        await addToCartApi({
          productId:
            product.productId,

          variantId:
            product.id,

          quantity:
            product.quantity || 1,
        });

      await loadCart();

      return response;
    } catch (error) {
      console.error(
        "Add to cart error:",
        error
      );

      setError(error.message);

      throw error;
    }
  };

  // ==========================================
  // INCREASE QUANTITY
  // ==========================================

  const increaseQuantity = async (
    variantId
  ) => {
    const token =
      localStorage.getItem("etoken");

    // ==========================================
    // GUEST
    // ==========================================

    if (!token) {
      const guestCart =
        getGuestCart();

      const updatedCart =
        guestCart.map((item) => {
          if (
            item.variantId !==
            variantId
          ) {
            return item;
          }

          const quantity =
            Number(item.quantity) + 1;

          return {
            ...item,

            quantity,

            totalPrice:
              Number(
                item.variant?.price || 0
              ) * quantity,

            updatedAt:
              new Date().toISOString(),
          };
        });

      saveGuestCart(updatedCart);

      dispatch({
        type: "SET_CART",
        payload: updatedCart,
      });

      return;
    }

    // ==========================================
    // LOGGED IN
    // ==========================================

    try {
      setError(null);

      const currentItem =
        state.items.find(
          (item) =>
            item.variantId ===
            variantId
        );

      if (!currentItem) {
        return;
      }

      const newQuantity =
        Number(currentItem.quantity) +
        1;

      await updateCartQuantityApi(
        variantId,
        newQuantity
      );

      await loadCart();
    } catch (error) {
      console.error(
        "Increase quantity error:",
        error
      );

      setError(error.message);

      throw error;
    }
  };

  // ==========================================
  // DECREASE QUANTITY
  // ==========================================

  const decreaseQuantity = async (
    variantId
  ) => {
    const token =
      localStorage.getItem("etoken");

    // ==========================================
    // GUEST
    // ==========================================

    if (!token) {
      const guestCart =
        getGuestCart();

      const currentItem =
        guestCart.find(
          (item) =>
            item.variantId ===
            variantId
        );

      if (!currentItem) {
        return;
      }

      const newQuantity =
        Number(currentItem.quantity) -
        1;

      let updatedCart;

      // ----------------------------------------
      // REMOVE ITEM
      // ----------------------------------------

      if (newQuantity <= 0) {
        updatedCart =
          guestCart.filter(
            (item) =>
              item.variantId !==
              variantId
          );
      }

      // ----------------------------------------
      // DECREASE QUANTITY
      // ----------------------------------------

      else {
        updatedCart =
          guestCart.map(
            (item) => {
              if (
                item.variantId !==
                variantId
              ) {
                return item;
              }

              return {
                ...item,

                quantity:
                  newQuantity,

                totalPrice:
                  Number(
                    item.variant?.price ||
                      0
                  ) *
                  newQuantity,

                updatedAt:
                  new Date().toISOString(),
              };
            }
          );
      }

      saveGuestCart(updatedCart);

      dispatch({
        type: "SET_CART",
        payload: updatedCart,
      });

      return;
    }

    // ==========================================
    // LOGGED IN
    // ==========================================

    try {
      setError(null);

      const currentItem =
        state.items.find(
          (item) =>
            item.variantId ===
            variantId
        );

      if (!currentItem) {
        return;
      }

      const newQuantity =
        Number(currentItem.quantity) -
        1;

      if (newQuantity <= 0) {
        await removeFromCartApi(
          variantId
        );
      } else {
        await updateCartQuantityApi(
          variantId,
          newQuantity
        );
      }

      await loadCart();
    } catch (error) {
      console.error(
        "Decrease quantity error:",
        error
      );

      setError(error.message);

      throw error;
    }
  };

  // ==========================================
  // REMOVE FROM CART
  // ==========================================

  const removeFromCart = async (
    variantId
  ) => {
    const token =
      localStorage.getItem("etoken");

    // ==========================================
    // GUEST
    // ==========================================

    if (!token) {
      const guestCart =
        getGuestCart();

      const updatedCart =
        guestCart.filter(
          (item) =>
            item.variantId !==
            variantId
        );

      saveGuestCart(updatedCart);

      dispatch({
        type: "SET_CART",
        payload: updatedCart,
      });

      return;
    }

    // ==========================================
    // LOGGED IN
    // ==========================================

    try {
      setError(null);

      await removeFromCartApi(
        variantId
      );

      await loadCart();
    } catch (error) {
      console.error(
        "Remove from cart error:",
        error
      );

      setError(error.message);

      throw error;
    }
  };

  // ==========================================
  // CLEAR CART
  // ==========================================

  const clearCart = async () => {
    const token =
      localStorage.getItem("etoken");

    // ==========================================
    // GUEST
    // ==========================================

    if (!token) {
      clearGuestCart();

      dispatch({
        type: "CLEAR_CART",
      });

      return;
    }

    // ==========================================
    // LOGGED IN
    // ==========================================

    try {
      setError(null);

      await clearCartApi();

      dispatch({
        type: "CLEAR_CART",
      });
    } catch (error) {
      console.error(
        "Clear cart error:",
        error
      );

      setError(error.message);

      throw error;
    }
  };

  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  const totalItems =
    state.items.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );

  // ==========================================
  // SUBTOTAL
  // ==========================================

  const subtotal =
    state.items.reduce(
      (total, item) => {
        const price =
          item.totalPrice !==
          undefined
            ? Number(
                item.totalPrice
              )
            : Number(
                item.variant?.price ||
                  0
              ) *
              Number(
                item.quantity || 0
              );

        return total + price;
      },
      0
    );

  // ==========================================
  // SHIPPING
  // ==========================================

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= 1000
      ? 0
      : 100;

  // ==========================================
  // TOTAL
  // ==========================================

  const total =
    subtotal + shipping;

  // ==========================================
  // CONTEXT VALUE
  // ==========================================

  const value = useMemo(
    () => ({
      items: state.items,

      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,

      loadCart,
      syncGuestCart,

      totalItems,
      subtotal,
      shipping,
      total,

      loading,
      error,
    }),
    [
      state.items,
      totalItems,
      subtotal,
      shipping,
      total,
      loading,
      error,
    ]
  );

  return (
    <CartContext.Provider
      value={value}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
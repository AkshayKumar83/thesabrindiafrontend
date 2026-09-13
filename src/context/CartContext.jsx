import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

const CartContext = createContext(null);

const initialState = {
  items: [],
};

function cartReducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const product = action.payload;

      const existingItem = state.items.find(
        (item) => item.id === product.id
      );

      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          ),
        };
      }

      return {
        ...state,
        items: [
          ...state.items,
          {
            ...product,
            quantity: 1,
          },
        ],
      };
    }

    case "INCREASE_QUANTITY":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        ),
      };

    case "DECREASE_QUANTITY":
      return {
        ...state,
        items: state.items
          .map((item) =>
            item.id === action.payload
              ? {
                  ...item,
                  quantity: item.quantity - 1,
                }
              : item
          )
          .filter((item) => item.quantity > 0),
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.id !== action.payload
        ),
      };

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
      };

    case "LOAD_CART":
      return {
        ...state,
        items: action.payload || [],
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

  // Load saved cart
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) return;

    try {
      dispatch({
        type: "LOAD_CART",
        payload: JSON.parse(savedCart),
      });
    } catch (error) {
      console.error("Unable to load cart", error);
    }
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem(
      "cart",
      JSON.stringify(state.items)
    );
  }, [state.items]);

  const addToCart = (product) => {
    dispatch({
      type: "ADD_TO_CART",
      payload: product,
    });
  };

  const increaseQuantity = (productId) => {
    dispatch({
      type: "INCREASE_QUANTITY",
      payload: productId,
    });
  };

  const decreaseQuantity = (productId) => {
    dispatch({
      type: "DECREASE_QUANTITY",
      payload: productId,
    });
  };

  const removeFromCart = (productId) => {
    dispatch({
      type: "REMOVE_FROM_CART",
      payload: productId,
    });
  };

  const clearCart = () => {
    dispatch({
      type: "CLEAR_CART",
    });
  };

  const totalItems = state.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = state.items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const shipping =
    subtotal === 0
      ? 0
      : subtotal >= 1000
      ? 0
      : 100;

  const total = subtotal + shipping;

  const value = useMemo(
    () => ({
      items: state.items,
      addToCart,
      increaseQuantity,
      decreaseQuantity,
      removeFromCart,
      clearCart,
      totalItems,
      subtotal,
      shipping,
      total,
    }),
    [
      state.items,
      totalItems,
      subtotal,
      shipping,
      total,
    ]
  );

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
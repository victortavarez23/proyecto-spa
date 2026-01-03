import { useReducer } from 'react';

// Acciones del carrito
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART'
};

// Reducer para manejar el estado del carrito
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM:
      const existingItem = state.items.find(item => item.id === action.payload.id);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }

      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }]
      };

    case CART_ACTIONS.REMOVE_ITEM:
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
      };

    case CART_ACTIONS.UPDATE_QUANTITY:
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0)
      };

    case CART_ACTIONS.CLEAR_CART:
      return {
        ...state,
        items: []
      };

    default:
      return state;
  }
};

// Hook personalizado
const useCart = () => {
  // AQUÍ ESTÁ EL CAMBIO: Inicializamos con datos de prueba
  const [cartState, dispatch] = useReducer(cartReducer, {
    items: [
      { 
        id: 1, 
        name: "Plan Diseño Web", 
        price: 500, 
        quantity: 1, 
        image: "https://cdn-icons-png.flaticon.com/512/2343/2343734.png" 
      },
      { 
        id: 2, 
        name: "Consultoría SEO", 
        price: 300, 
        quantity: 2, 
        image: "https://informaticatemps.com/assets/img/ico_seo_local.png" 
      }
    ]
  });

  const addItem = (item) => {
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: item });
  };

  const removeItem = (itemId) => {
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: itemId });
  };

  const updateQuantity = (itemId, quantity) => {
    dispatch({ type: CART_ACTIONS.UPDATE_QUANTITY, payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  const totalItems = cartState.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = cartState.items.reduce((total, item) => total + (item.price * item.quantity), 0);

  return {
    items: cartState.items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice
  };
};

export default useCart;
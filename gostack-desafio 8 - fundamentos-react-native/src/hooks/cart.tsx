import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Omit<Product, 'quantity'>): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
      const loadedProducts = await AsyncStorage.getItem('@products');
      if (loadedProducts) {
        setProducts(JSON.parse(loadedProducts));
      }
    }

    loadProducts();
  }, []);

  const addToCart = useCallback(
    async product => {
      // TODO ADD A NEW ITEM TO THE CART
      const findProduct = products.find(item => item.id === product.id);
      if (findProduct) {
        // Achei um produto igual,Aumento a quantidade em 1
        const index = products.findIndex(item => item.id === product.id);
        products[index].quantity += 1;
        setProducts([...products]);
      } else {
        //  Não achei um produto igual, pode adiconar!;
        const newProduct = {
          ...product,
          quantity: 1,
        };
        setProducts([...products, newProduct]);
      }
      await AsyncStorage.setItem('@products', JSON.stringify(products));
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      // TODO INCREMENTS A PRODUCT QUANTITY IN THE CART
      const index = products.findIndex(product => product.id === id);
      products[index].quantity += 1;
      setProducts([...products]);
      await AsyncStorage.setItem('@products', JSON.stringify(products));
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      // TODO DECREMENTS A PRODUCT QUANTITY IN THE CART
      const index = products.findIndex(product => product.id === id);
      if (products[index].quantity === 1) {
        setProducts(() => {
          return products.filter(product => product.id !== id);
        });
      } else {
        // se não for = 1 eu preciso retirar a quantidade em 1, depois atualizar com setProcuts
        products[index].quantity -= 1;
        setProducts([...products]);
      }
      await AsyncStorage.setItem('@products', JSON.stringify(products));
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };

// hooks/useNewInProducts.ts
import { useEffect } from 'react';
import { productService } from '@/services/product.service';
import { useProductStore } from '@/store/useProductStore';

export function useNewInProducts(limit: number = 12) {
  const { 
    newInProducts, 
    isLoadingNewIn, 
    setNewInProducts, 
    setLoadingNewIn 
  } = useProductStore();

  useEffect(() => {
    const fetchNewInProducts = async () => {
      setLoadingNewIn(true);
      try {
        const response = await productService.getNewInProducts(limit);
        if (response.success) {
          setNewInProducts(response.data);
        }
      } catch (error) {
        console.error('Error loading new in products:', error);
      } finally {
        setLoadingNewIn(false);
      }
    };

    fetchNewInProducts();
  }, [limit, setNewInProducts, setLoadingNewIn]);

  return { 
    products: newInProducts, 
    isLoading: isLoadingNewIn 
  };
}
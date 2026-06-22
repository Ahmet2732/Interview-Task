/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { getCatalog, getDefaultBundleState } from '../service/catalogService';
import type { BundleState, Catalog, Product } from '../types';
import { parseSelectionKey, selectionKey } from '../types';
import {
  buildReviewItems,
  calculatePricing,
  countSelectedProductsInStep,
  getDefaultVariantId,
  getProductMap,
} from '../utils/bundle';
import { loadSavedBundle, saveBundle } from '../utils/storage';

type BundleAction =
  | { type: 'SET_ACTIVE_STEP'; step: number }
  | { type: 'SET_ACTIVE_VARIANT'; productId: string; variantId: string }
  | { type: 'SET_QUANTITY'; productId: string; variantId: string | null; quantity: number }
  | { type: 'RESTORE'; state: BundleState };

interface BundleContextValue {
  catalog: Catalog;
  productMap: Map<string, Product>;
  state: BundleState;
  setActiveStep: (step: number) => void;
  goToNextStep: (currentStep: number) => void;
  setActiveVariant: (productId: string, variantId: string) => void;
  setQuantity: (productId: string, variantId: string | null, quantity: number) => void;
  saveForLater: () => void;
  getStepSelectedCount: (stepId: string) => number;
  reviewItems: ReturnType<typeof buildReviewItems>;
  pricing: ReturnType<typeof calculatePricing>;
  hasSavedConfig: boolean;
}

const catalog = getCatalog();
const defaultState = getDefaultBundleState();

function getInitialState(): BundleState {
  const saved = loadSavedBundle();
  if (saved) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { savedAt: _savedAt, ...rest } = saved;
    return rest;
  }

  const activeVariants = { ...defaultState.activeVariants };
  for (const step of catalog.steps) {
    for (const product of step.products) {
      if (product.variants && !activeVariants[product.id]) {
        activeVariants[product.id] = getDefaultVariantId(product) ?? product.variants[0].id;
      }
    }
  }

  return {
    ...defaultState,
    activeVariants,
  };
}

function bundleReducer(state: BundleState, action: BundleAction): BundleState {
  switch (action.type) {
    case 'SET_ACTIVE_STEP':
      return { ...state, activeStep: action.step };
    case 'SET_ACTIVE_VARIANT':
      return {
        ...state,
        activeVariants: {
          ...state.activeVariants,
          [action.productId]: action.variantId,
        },
      };
    case 'SET_QUANTITY': {
      const key = selectionKey(action.productId, action.variantId);
      const nextQuantities = { ...state.quantities };

      if (action.quantity <= 0) {
        delete nextQuantities[key];
      } else {
        nextQuantities[key] = action.quantity;
      }

      if (action.variantId === null) {
        const product = catalog.steps
          .flatMap((step) => step.products)
          .find((item) => item.id === action.productId);

        if (product?.reviewCategory === 'plan') {
          for (const planProduct of catalog.steps
            .find((step) => step.id === 'plan')
            ?.products ?? []) {
            if (planProduct.id !== action.productId) {
              delete nextQuantities[selectionKey(planProduct.id, null)];
            }
          }
        }
      }

      return { ...state, quantities: nextQuantities };
    }
    case 'RESTORE':
      return action.state;
    default:
      return state;
  }
}

const BundleContext = createContext<BundleContextValue | null>(null);

export function BundleProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bundleReducer, undefined, getInitialState);
  const productMap = useMemo(() => getProductMap(catalog), []);

  const setActiveStep = useCallback((step: number) => {
    dispatch({ type: 'SET_ACTIVE_STEP', step });
  }, []);

  const goToNextStep = useCallback((currentStep: number) => {
    dispatch({ type: 'SET_ACTIVE_STEP', step: Math.min(currentStep + 1, catalog.steps.length) });
  }, []);

  const setActiveVariant = useCallback((productId: string, variantId: string) => {
    dispatch({ type: 'SET_ACTIVE_VARIANT', productId, variantId });
  }, []);

  const setQuantity = useCallback(
    (productId: string, variantId: string | null, quantity: number) => {
      const product = productMap.get(productId);
      const max = product?.maxQuantity ?? 99;
      dispatch({
        type: 'SET_QUANTITY',
        productId,
        variantId,
        quantity: Math.max(0, Math.min(quantity, max)),
      });
    },
    [productMap],
  );

  const saveForLater = useCallback(() => {
    saveBundle({
      ...state,
      savedAt: new Date().toISOString(),
    });
  }, [state]);

  const getStepSelectedCount = useCallback(
    (stepId: string) => countSelectedProductsInStep(stepId, state.quantities, productMap),
    [state.quantities, productMap],
  );

  const reviewItems = useMemo(
    () => buildReviewItems(state.quantities, productMap),
    [state.quantities, productMap],
  );

  const pricing = useMemo(
    () => calculatePricing(state.quantities, productMap),
    [state.quantities, productMap],
  );

  const value = useMemo<BundleContextValue>(
    () => ({
      catalog,
      productMap,
      state,
      setActiveStep,
      goToNextStep,
      setActiveVariant,
      setQuantity,
      saveForLater,
      getStepSelectedCount,
      reviewItems,
      pricing,
      hasSavedConfig: Boolean(loadSavedBundle()),
    }),
    [
      state,
      setActiveStep,
      goToNextStep,
      setActiveVariant,
      setQuantity,
      saveForLater,
      getStepSelectedCount,
      reviewItems,
      pricing,
    ],
  );

  return <BundleContext.Provider value={value}>{children}</BundleContext.Provider>;
}

export function useBundle() {
  const context = useContext(BundleContext);
  if (!context) {
    throw new Error('useBundle must be used within BundleProvider');
  }
  return context;
}

export function useReviewQuantityUpdater() {
  const { setQuantity } = useBundle();

  return useCallback(
    (key: string, quantity: number) => {
      const { productId, variantId } = parseSelectionKey(key);
      setQuantity(productId, variantId, quantity);
    },
    [setQuantity],
  );
}

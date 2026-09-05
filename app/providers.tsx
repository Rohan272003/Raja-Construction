'use client';

import { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import { initializeAuth } from '../src/store/slices/authSlice';
import { initializeShortlist } from '../src/store/slices/shortlistSlice';

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    store.dispatch(initializeAuth());
    store.dispatch(initializeShortlist());
  }, []);

  return <Provider store={store}>{children}</Provider>;
}

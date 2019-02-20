// MobX helpers

// ----------------------------------------------------------------------------
// IMPORTS

import * as React from "react";
import { runInAction, autorun, toJS } from "mobx";
import { observer, inject } from "mobx-react";

/* Local */
import { Store } from "@/data/store";

// ----------------------------------------------------------------------------

export type WithStore<T> = T & {
  store: Store;
};

export function withStore<P>(
  Component: React.ComponentType<WithStore<P>>,
): React.ComponentType<P> {
  return inject<{ store: Store }, {}, {}, {}>(stores => ({
    store: stores.store,
  }))(observer(Component as any));
}

// CLIENT-ONLY: Rehydrate JSON state to MobX
export function rehydrate(store: Store) {
  // Helper to parse and rehydrate the store
  const init = (data: any) => {
    if (typeof data === "object") {
      Object.keys(data).forEach(key => ((store as any)[key] = data[key]));
    }
  };

  // Perform the rehydration atomically
  runInAction(() => {
    init((window as any).__STORE__);
    try {
      const parsed = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)!);
      if (parsed) {
        init(parsed);
      }
    } catch (_) {
      /* Ignore localStorage parse errors */
    }
  });
}

// CLIENT-ONLY: Save store changes to localStorage
export function autosave(store: Store) {
  autorun(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toJS(store)));
  });
}

import {
  type RowData,
  createTable,
  type TableOptions,
  type TableOptionsResolved
} from "@tanstack/table-core";
import { readable, writable, derived, type Readable, get } from "svelte/store";

type ReadableOrVal<T> = T | Readable<T>;

export function createSvelteTable<TData extends RowData>(
  options: ReadableOrVal<TableOptions<TData>>
) {
  let optionsStore: Readable<TableOptions<TData>>;

  if ("subscribe" in options) {
    optionsStore = options;
  } else {
    optionsStore = readable(options);
  }

  let resolvedOptions: TableOptionsResolved<TData> = {
    state: {}, // Dummy state
    onStateChange: () => {}, // noop
    renderFallbackValue: null,
    ...get(optionsStore)
  };

  let table = createTable(resolvedOptions);

  let stateStore = writable(table.initialState);
  // combine stores
  let stateOptionsStore = derived([stateStore, optionsStore], (s) => s);
  const tableReadable = readable(table, function start(set) {
    const unsubscribe = stateOptionsStore.subscribe(([state, options]) => {
      table.setOptions((prev) => {
        return {
          ...prev,
          ...options,
          state: { ...state, ...options.state },
          onStateChange: (updater) => {
            if (updater instanceof Function) {
              stateStore.update(updater);
            } else {
              stateStore.set(updater);
            }
            resolvedOptions.onStateChange?.(updater);
          }
        };
      });
      // trigger rerender
      set(table);
    });

    return function stop() {
      unsubscribe();
    };
  });

  return tableReadable;
}

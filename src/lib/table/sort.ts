import type { SortingState } from "@tanstack/table-core";

export function readSort(searchParams: URLSearchParams, prefix = ""): SortingState {
  const sortBy = searchParams.get(`${prefix}sortBy`);
  const sortDesc = searchParams.get(`${prefix}sortDesc`);

  if (!sortBy) {
    return [];
  }

  return [
    {
      id: sortBy,
      desc: sortDesc === "true"
    }
  ];
}

export function writeSort(
  searchParams: URLSearchParams,
  sorting: SortingState,
  prefix = ""
): URLSearchParams {
  const newParams = new URLSearchParams(searchParams);

  if (sorting.length === 0) {
    newParams.delete(`${prefix}sortBy`);
    newParams.delete(`${prefix}sortDesc`);
  } else {
    newParams.set(`${prefix}sortBy`, sorting[0].id);
    if (sorting[0].desc) {
      newParams.set(`${prefix}sortDesc`, "true");
    } else {
      newParams.delete(`${prefix}sortDesc`);
    }
  }

  return newParams;
}

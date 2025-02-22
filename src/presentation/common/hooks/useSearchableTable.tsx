import { useState, useMemo } from "react";

export function useSearchableTable<T>(data: T[], searchableFields: (keyof T)[]) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery) {
      return data;
    }

    const query = searchQuery.toLowerCase();

    return data.filter((item) =>
      searchableFields.some((field) => String(item[field]).toLowerCase().includes(query)),
    );
  }, [data, searchQuery, searchableFields]);

  return { filteredData, searchQuery, setSearchQuery };
}

import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router";

type QueryParams = Record<string, string | number | boolean | null | undefined>;

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    const paramsObj: QueryParams = {};
    searchParams.forEach((value, key) => {
      paramsObj[key] = value;
    });
    return paramsObj;
  }, [searchParams]);

  const setParam = useCallback(
    (key: string, value: string | number | boolean | null | undefined) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);

        if (value === null || value === undefined || value === "") {
          newParams.delete(key);
        } else {
          newParams.set(key, String(value));
        }

        return newParams;
      });
    },
    [setSearchParams],
  );

  const setMultipleParams = useCallback(
    (newParams: QueryParams) => {
      setSearchParams((prev) => {
        const newSearchParams = new URLSearchParams(prev);

        Object.entries(newParams).forEach(([key, value]) => {
          if (value === null || value === undefined || value === "") {
            newSearchParams.delete(key);
          } else {
            newSearchParams.set(key, String(value));
          }
        });

        return newSearchParams;
      });
    },
    [setSearchParams],
  );

  const removeParam = useCallback(
    (key: string) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.delete(key);
        return newParams;
      });
    },
    [setSearchParams],
  );

  const getParam = useCallback(
    (key: string) => {
      return searchParams.get(key);
    },
    [searchParams],
  );

  const clearAll = useCallback(() => {
    setSearchParams(new URLSearchParams());
  }, [setSearchParams]);

  return {
    params,
    setParam,
    setMultipleParams,
    removeParam,
    getParam,
    clearAll,
    searchParams: searchParams.toString(),
  };
};

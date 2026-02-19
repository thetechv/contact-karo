import { useEffect, useState, useCallback, useRef } from "react";

const useQuery = (dataFunction, queryKey, queryFn, options = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Store the dataFunction in a ref to avoid stale closures
  const dataFunctionRef = useRef(dataFunction);
  dataFunctionRef.current = dataFunction;

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const result = await dataFunctionRef.current();
      setData(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, isLoading, refetch: fetchData };
};

export default useQuery;

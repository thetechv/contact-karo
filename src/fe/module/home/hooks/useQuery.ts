import { useEffect, useState } from "react";
import { useCallback } from "react";

const useQuery = (query: any) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const fetchData = useCallback(async () => {
    setLoading(true);
    const data = await query();
    setData(data);
    setLoading(false);
  }, [query]);
  

  const refetch = () => {
    fetchData();
  };


  useEffect(() => {
    fetchData();
  }, [query,fetchData]);

  return {data, loading, error, refetch};
};

export default useQuery;

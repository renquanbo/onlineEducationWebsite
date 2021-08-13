import { useEffect, useState } from "react";
import { IResponse, ListResponse, Paginator } from "../../app/model/api";

export function useListEffect<T extends ListResponse, U>(
  apiFn: (params: any) => Promise<IResponse<T>>,
  sourceKey: keyof T,
  onlyFresh = true
) {
  const [data, setData] = useState<U[]>([]);
  const [paginator, setPaginator] = useState<Paginator>({ limit: 20, page: 1 });
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [modifyDataSuccessTimes, setModifyDataSuccessTimes] = useState(0);

  useEffect(() => {
    setLoading(true);
    apiFn(paginator).then((res) => {
      const { data: newData } = res;
      if(newData === undefined) {
        return;
      }
      const fresh = (newData[sourceKey as keyof T] as unknown) as U[];
      const source = onlyFresh ? fresh : [...data, ...fresh];
      setData(source);
      setTotal(newData!.total);
      setHasMore(
        onlyFresh ? !!source.length && source.length < newData!.total : newData!.total > source.length
      );
    })
    setLoading(false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[paginator,modifyDataSuccessTimes]);

  return {
    data,
    hasMore,
    paginator,
    total,
    loading,
    modifyDataSuccessTimes,
    setPaginator,
    setData,
    setTotal,
    setLoading,
    setModifyDataSuccessTimes
  }
}
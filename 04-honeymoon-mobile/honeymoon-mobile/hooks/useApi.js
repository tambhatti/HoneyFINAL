import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic data-fetching hook.
 *
 * Usage:
 *   const { data, loading, error, refresh } = useApi(UserService.getVendors, { category: 'Venue' });
 *
 * @param {Function} apiFn      - Service function to call
 * @param {any}      args       - Arguments to pass to apiFn (single value OR object)
 * @param {object}   options
 *   @param {boolean} immediate  - Fetch on mount (default: true)
 *   @param {any}     fallback   - Default value before first fetch
 */
export function useApi(apiFn, args = undefined, options = {}) {
  const { immediate = true, fallback = null } = options;

  const [data,    setData]    = useState(fallback);
  const [loading, setLoading] = useState(immediate);
  const [error,   setError]   = useState(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; };
  }, []);

  const fetch = useCallback(async (overrideArgs) => {
    setLoading(true);
    setError(null);
    try {
      const callArgs = overrideArgs !== undefined ? overrideArgs : args;
      const result = await (callArgs !== undefined ? apiFn(callArgs) : apiFn());
      if (mountedRef.current) setData(result);
      return result;
    } catch (err) {
      if (mountedRef.current) setError(err?.message || 'Something went wrong');
      throw err;
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [apiFn, args]); // eslint-disable-line

  useEffect(() => {
    if (immediate) fetch();
  }, []); // eslint-disable-line

  return { data, loading, error, refresh: fetch };
}

/**
 * Pagination hook — handles page/limit/total state on top of useApi.
 */
export function usePaginatedApi(apiFn, params = {}, options = {}) {
  const [page,  setPage]  = useState(1);
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const limit = options.limit || 10;

  const load = useCallback(async (p = 1, reset = false) => {
    setLoading(true);
    setError(null);
    try {
      const result = await apiFn({ ...params, page: p, limit });
      const newItems = result.data || [];
      setItems(prev => (reset || p === 1) ? newItems : [...prev, ...newItems]);
      setTotal(result.total || 0);
      setPage(p);
      return result;
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, [apiFn, JSON.stringify(params), limit]); // eslint-disable-line

  useEffect(() => { load(1, true); }, [JSON.stringify(params)]); // eslint-disable-line

  const loadMore = useCallback(() => {
    if (!loading && items.length < total) load(page + 1);
  }, [loading, items.length, total, page, load]);

  const refresh = useCallback(() => load(1, true), [load]);

  return { items, total, loading, error, loadMore, refresh, hasMore: items.length < total };
}

export default useApi;

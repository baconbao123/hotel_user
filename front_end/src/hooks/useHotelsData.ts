import { useEffect, useState, useCallback } from "react";
import { getHotelData, HotelApiResponse } from "@/api/getHotelData";
import { API_CONFIG } from "@/config/environment";

export function useInfiniteHotels() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<any>(null);
  const [provinces, setProvinces] = useState<any[]>([]);

  const fetchHotels = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getHotelData(`${API_CONFIG.BASE_URL}/user/home?page=${page}`);
      const newHotels = res.result.hotels.content;
      setHotels(prev => [...prev, ...newHotels]);
      setHasMore(newHotels.length > 0);
      setPage(prev => prev + 1);
      if (page === 1) {
        setFilters(res.result.filters);
        setProvinces(res.result.provinces);
      }
    } catch (err: any) {
      setError(err.message || "Error fetching data");
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  useEffect(() => {
    fetchHotels();
 
  }, []);

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 &&
        !loading &&
        hasMore
      ) {
        fetchHotels();
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchHotels, loading, hasMore]);

  return { hotels, loading, error, hasMore, filters, provinces };
} 
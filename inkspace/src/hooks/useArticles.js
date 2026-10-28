import { useEffect, useState } from "react";
import { getPublishedArticles } from "../utils/storage";

export default function useArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Small delay so the loading skeleton is visible (simulates a network call)
    const timer = setTimeout(() => {
      try {
        setArticles(getPublishedArticles());
      } catch {
        setError("We couldn't load the articles. Please refresh the page.");
      }
      setLoading(false);
    }, 350);
    return () => clearTimeout(timer);
  }, []);

  return { articles, loading, error };
}
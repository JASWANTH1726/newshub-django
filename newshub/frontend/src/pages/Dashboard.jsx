import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import NewsCard from '../components/NewsCard';
import FilterPanel from '../components/FilterPanel';
import api from '../services/api';
import styles from './Dashboard.module.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [articles, setArticles] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [activeNewspaper, setActiveNewspaper] = useState('');

  const fetchNews = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const [feedRes, recRes] = await Promise.all([
        api.get(`/api/news/feed?${params}`),
        api.get('/api/news/recommendations'),
      ]);
      setArticles(feedRes.data.articles || []);
      setActiveNewspaper(feedRes.data.activeNewspaper || '');
      setRecommendations(recRes.data.articles || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const handleSearch = e => {
    e.preventDefault();
    if (query.trim()) fetchNews({ query: query.trim() });
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>📡 Live News</h1>
          <form onSubmit={handleSearch} className={styles.searchBar}>
            <input
              type="text"
              placeholder="Search news..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button type="submit" className="btn-primary">🔍 Search</button>
          </form>
        </div>

        <FilterPanel onFilter={fetchNews} />

        {loading ? (
          <div className={styles.loading}>Loading articles...</div>
        ) : (
          <>
            {activeNewspaper && (
              <p className={styles.activeSource}>📰 {activeNewspaper}</p>
            )}
            {articles.length > 0 ? (
              <div className="news-grid">
                {articles.map((article, i) => (
                  <NewsCard key={i} article={article} />
                ))}
              </div>
            ) : (
              <div className="no-results">
                <span className="icon">🔍</span>
                <p>No articles found. Try different keywords.</p>
              </div>
            )}

            {recommendations.length > 0 && (
              <>
                <div className="section-heading">⭐ Recommended For You</div>
                <div className="news-grid">
                  {recommendations.map((article, i) => (
                    <NewsCard key={i} article={article} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

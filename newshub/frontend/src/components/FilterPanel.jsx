import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './FilterPanel.module.css';

export default function FilterPanel({ onFilter }) {
  const { user } = useAuth();
  const pref = user?.preferences || {};
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    language: pref.newsLanguage || 'en',
    area: pref.area || 'national',
    newspaper: pref.newspaper || '',
    fromDate: '',
  });

  const handleSubmit = e => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header} onClick={() => setOpen(!open)}>
        <h3>🎛️ Search & Filter News</h3>
        <span className={`${styles.toggle} ${open ? styles.open : ''}`}>▼</span>
      </div>
      {open && (
        <div className={styles.body}>
          <form onSubmit={handleSubmit}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>📰 News Language</label>
                <select
                  value={filters.language}
                  onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="te">తెలుగు</option>
                  <option value="ta">தமிழ்</option>
                  <option value="kn">ಕನ್ನಡ</option>
                  <option value="ml">മലയാളം</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>📍 Area</label>
                <input
                  type="text"
                  value={filters.area}
                  onChange={e => setFilters(f => ({ ...f, area: e.target.value }))}
                  placeholder="e.g., hyderabad, mumbai"
                />
              </div>
              <div className={styles.field}>
                <label>🗞️ Newspaper</label>
                <input
                  type="text"
                  value={filters.newspaper}
                  onChange={e => setFilters(f => ({ ...f, newspaper: e.target.value }))}
                  placeholder="e.g., times_of_india"
                />
              </div>
              <div className={styles.field}>
                <label>📅 From Date</label>
                <input
                  type="date"
                  value={filters.fromDate}
                  onChange={e => setFilters(f => ({ ...f, fromDate: e.target.value }))}
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">🔍 Apply Filters</button>
          </form>
        </div>
      )}
    </div>
  );
}

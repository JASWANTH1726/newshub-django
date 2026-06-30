import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import styles from './FilterPanel.module.css';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
  { value: 'ml', label: 'മലയാളം' },
  { value: 'mr', label: 'मराठी' },
  { value: 'bn', label: 'বাংলা' },
];

const AREAS = [
  { value: '', label: '-- All Areas --' },
  { value: 'national', label: 'National (All India)' },
  { value: 'international', label: 'International' },
  { label: '── Andhra Pradesh ──', disabled: true },
  { value: 'vizag', label: 'Vizag (Visakhapatnam)' },
  { value: 'vijayawada', label: 'Vijayawada' },
  { value: 'guntur', label: 'Guntur' },
  { value: 'tirupati', label: 'Tirupati' },
  { value: 'kurnool', label: 'Kurnool' },
  { value: 'nellore', label: 'Nellore' },
  { value: 'rajahmundry', label: 'Rajahmundry' },
  { value: 'kakinada', label: 'Kakinada' },
  { label: '── Telangana ──', disabled: true },
  { value: 'hyderabad', label: 'Hyderabad' },
  { value: 'hyderabad_hitech', label: 'Hyderabad - HiTech City' },
  { value: 'warangal', label: 'Warangal' },
  { value: 'karimnagar', label: 'Karimnagar' },
  { value: 'nizamabad', label: 'Nizamabad' },
  { label: '── Tamil Nadu ──', disabled: true },
  { value: 'chennai', label: 'Chennai' },
  { value: 'coimbatore', label: 'Coimbatore' },
  { value: 'madurai', label: 'Madurai' },
  { label: '── Karnataka ──', disabled: true },
  { value: 'bangalore', label: 'Bangalore' },
  { value: 'mysore', label: 'Mysore' },
  { value: 'mangalore', label: 'Mangalore' },
  { label: '── Kerala ──', disabled: true },
  { value: 'kochi', label: 'Kochi' },
  { value: 'thiruvananthapuram', label: 'Thiruvananthapuram' },
  { label: '── Maharashtra ──', disabled: true },
  { value: 'mumbai', label: 'Mumbai' },
  { value: 'pune', label: 'Pune' },
  { value: 'nagpur', label: 'Nagpur' },
  { label: '── Delhi / NCR ──', disabled: true },
  { value: 'delhi', label: 'New Delhi' },
  { value: 'noida', label: 'Noida' },
  { value: 'gurgaon', label: 'Gurgaon' },
  { label: '── West Bengal ──', disabled: true },
  { value: 'kolkata', label: 'Kolkata' },
  { label: '── Gujarat ──', disabled: true },
  { value: 'ahmedabad', label: 'Ahmedabad' },
  { value: 'surat', label: 'Surat' },
  { label: '── Rajasthan ──', disabled: true },
  { value: 'jaipur', label: 'Jaipur' },
  { value: 'jodhpur', label: 'Jodhpur' },
  { label: '── Punjab / Haryana ──', disabled: true },
  { value: 'chandigarh', label: 'Chandigarh' },
  { value: 'amritsar', label: 'Amritsar' },
  { label: '── Uttar Pradesh ──', disabled: true },
  { value: 'lucknow', label: 'Lucknow' },
  { value: 'kanpur', label: 'Kanpur' },
  { value: 'varanasi', label: 'Varanasi' },
];

const NEWSPAPERS = [
  { value: '', label: '-- All Newspapers --' },
  { label: '── English National ──', disabled: true },
  { value: 'times_of_india', label: 'Times of India' },
  { value: 'the_hindu', label: 'The Hindu' },
  { value: 'indian_express', label: 'The Indian Express' },
  { value: 'hindustan_times', label: 'Hindustan Times' },
  { value: 'deccan_herald', label: 'Deccan Herald' },
  { value: 'economic_times', label: 'Economic Times' },
  { value: 'business_standard', label: 'Business Standard' },
  { label: '── English International ──', disabled: true },
  { value: 'bbc', label: 'BBC News' },
  { value: 'reuters', label: 'Reuters' },
  { value: 'guardian', label: 'The Guardian' },
  { value: 'al_jazeera', label: 'Al Jazeera' },
  { value: 'cnn', label: 'CNN' },
  { label: '── Hindi ──', disabled: true },
  { value: 'dainik_jagran', label: 'Dainik Jagran' },
  { value: 'dainik_bhaskar', label: 'Dainik Bhaskar' },
  { value: 'amar_ujala', label: 'Amar Ujala' },
  { label: '── Telugu ──', disabled: true },
  { value: 'eenadu', label: 'Eenadu' },
  { value: 'sakshi', label: 'Sakshi' },
  { value: 'andhrajyothy', label: 'Andhra Jyothy' },
  { label: '── Tamil ──', disabled: true },
  { value: 'daily_thanthi', label: 'Dina Thanthi' },
  { value: 'dinamalar', label: 'Dinamalar' },
  { label: '── Kannada ──', disabled: true },
  { value: 'vijaya_karnataka', label: 'Vijaya Karnataka' },
  { value: 'prajavani', label: 'Prajavani' },
  { label: '── Malayalam ──', disabled: true },
  { value: 'malayala_manorama', label: 'Malayala Manorama' },
  { value: 'mathrubhumi', label: 'Mathrubhumi' },
  { label: '── Marathi ──', disabled: true },
  { value: 'lokmat', label: 'Lokmat' },
  { label: '── Bengali ──', disabled: true },
  { value: 'anandabazar', label: 'Anandabazar Patrika' },
  { label: '── Gujarati ──', disabled: true },
  { value: 'gujarat_samachar', label: 'Gujarat Samachar' },
];

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

  const handleReset = () => {
    const reset = { language: 'en', area: 'national', newspaper: '', fromDate: '' };
    setFilters(reset);
    onFilter(reset);
  };

  return (
    <div className={styles.panel}>
      <div className={styles.header} onClick={() => setOpen(!open)}>
        <h3>🎛️ Filter News</h3>
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
                  {LANGUAGES.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>📍 Area</label>
                <select
                  value={filters.area}
                  onChange={e => setFilters(f => ({ ...f, area: e.target.value }))}
                >
                  {AREAS.map((a, i) =>
                    a.disabled
                      ? <option key={i} disabled>{a.label}</option>
                      : <option key={a.value} value={a.value}>{a.label}</option>
                  )}
                </select>
              </div>
              <div className={styles.field}>
                <label>🗞️ Newspaper</label>
                <select
                  value={filters.newspaper}
                  onChange={e => setFilters(f => ({ ...f, newspaper: e.target.value }))}
                >
                  {NEWSPAPERS.map((n, i) =>
                    n.disabled
                      ? <option key={i} disabled>{n.label}</option>
                      : <option key={n.value} value={n.value}>{n.label}</option>
                  )}
                </select>
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
            <div className={styles.actions}>
              <button type="submit" className="btn-primary">🔍 Apply Filters</button>
              <button type="button" className="btn-secondary" onClick={handleReset}>↺ Reset</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

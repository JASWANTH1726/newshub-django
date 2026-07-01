import { useState, useEffect } from 'react';
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

const AREAS_BY_LANG = {
  en: [
    { value: '', label: '-- All Areas --' },
    { value: 'national', label: 'National (All India)' },
    { value: 'international', label: 'International' },
    { label: '── North India ──', disabled: true },
    { value: 'delhi', label: 'New Delhi' },
    { value: 'noida', label: 'Noida' },
    { value: 'gurgaon', label: 'Gurgaon' },
    { value: 'lucknow', label: 'Lucknow' },
    { value: 'kanpur', label: 'Kanpur' },
    { value: 'varanasi', label: 'Varanasi' },
    { value: 'chandigarh', label: 'Chandigarh' },
    { value: 'amritsar', label: 'Amritsar' },
    { label: '── South India ──', disabled: true },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'chennai', label: 'Chennai' },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'kochi', label: 'Kochi' },
    { label: '── West India ──', disabled: true },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'pune', label: 'Pune' },
    { value: 'ahmedabad', label: 'Ahmedabad' },
    { label: '── East India ──', disabled: true },
    { value: 'kolkata', label: 'Kolkata' },
    { value: 'patna', label: 'Patna' },
  ],
  te: [
    { value: '', label: '-- All Areas --' },
    { value: 'national', label: 'National (All India)' },
    { label: '── Andhra Pradesh ──', disabled: true },
    { value: 'vizag', label: 'Visakhapatnam (Vizag)' },
    { value: 'vijayawada', label: 'Vijayawada' },
    { value: 'guntur', label: 'Guntur' },
    { value: 'tirupati', label: 'Tirupati' },
    { value: 'kurnool', label: 'Kurnool' },
    { value: 'nellore', label: 'Nellore' },
    { value: 'rajahmundry', label: 'Rajahmundry' },
    { value: 'kakinada', label: 'Kakinada' },
    { value: 'eluru', label: 'Eluru' },
    { value: 'ongole', label: 'Ongole' },
    { value: 'kadapa', label: 'Kadapa' },
    { value: 'anantapur', label: 'Anantapur' },
    { value: 'srikakulam', label: 'Srikakulam' },
    { value: 'vizianagaram', label: 'Vizianagaram' },
    { label: '── Telangana ──', disabled: true },
    { value: 'hyderabad', label: 'Hyderabad' },
    { value: 'hyderabad_hitech', label: 'Hyderabad - HiTech City' },
    { value: 'hyderabad_secunderabad', label: 'Secunderabad' },
    { value: 'warangal', label: 'Warangal' },
    { value: 'karimnagar', label: 'Karimnagar' },
    { value: 'nizamabad', label: 'Nizamabad' },
    { value: 'khammam', label: 'Khammam' },
    { value: 'nalgonda', label: 'Nalgonda' },
    { value: 'adilabad', label: 'Adilabad' },
  ],
  ta: [
    { value: '', label: '-- All Areas --' },
    { value: 'national', label: 'National (All India)' },
    { label: '── Tamil Nadu ──', disabled: true },
    { value: 'chennai', label: 'Chennai' },
    { value: 'coimbatore', label: 'Coimbatore' },
    { value: 'madurai', label: 'Madurai' },
    { value: 'salem', label: 'Salem' },
    { value: 'trichy', label: 'Trichy' },
    { value: 'tirunelveli', label: 'Tirunelveli' },
    { value: 'vellore', label: 'Vellore' },
    { value: 'erode', label: 'Erode' },
  ],
  kn: [
    { value: '', label: '-- All Areas --' },
    { value: 'national', label: 'National (All India)' },
    { label: '── Karnataka ──', disabled: true },
    { value: 'bangalore', label: 'Bangalore' },
    { value: 'mysore', label: 'Mysore' },
    { value: 'mangalore', label: 'Mangalore' },
    { value: 'hubli', label: 'Hubli-Dharwad' },
    { value: 'belgaum', label: 'Belagavi' },
  ],
  ml: [
    { value: '', label: '-- All Areas --' },
    { value: 'national', label: 'National (All India)' },
    { label: '── Kerala ──', disabled: true },
    { value: 'kochi', label: 'Kochi' },
    { value: 'thiruvananthapuram', label: 'Thiruvananthapuram' },
    { value: 'kozhikode', label: 'Kozhikode' },
    { value: 'thrissur', label: 'Thrissur' },
    { value: 'kollam', label: 'Kollam' },
  ],
  hi: [
    { value: '', label: '-- All Areas --' },
    { value: 'national', label: 'National (All India)' },
    { label: '── Uttar Pradesh ──', disabled: true },
    { value: 'lucknow', label: 'Lucknow' },
    { value: 'kanpur', label: 'Kanpur' },
    { value: 'varanasi', label: 'Varanasi' },
    { value: 'agra', label: 'Agra' },
    { value: 'meerut', label: 'Meerut' },
    { label: '── Rajasthan ──', disabled: true },
    { value: 'jaipur', label: 'Jaipur' },
    { value: 'jodhpur', label: 'Jodhpur' },
    { value: 'udaipur', label: 'Udaipur' },
    { label: '── Madhya Pradesh ──', disabled: true },
    { value: 'bhopal', label: 'Bhopal' },
    { value: 'indore', label: 'Indore' },
    { label: '── Delhi / NCR ──', disabled: true },
    { value: 'delhi', label: 'New Delhi' },
    { value: 'noida', label: 'Noida' },
    { value: 'gurgaon', label: 'Gurgaon' },
    { label: '── Bihar ──', disabled: true },
    { value: 'patna', label: 'Patna' },
  ],
  mr: [
    { value: '', label: '-- All Areas --' },
    { value: 'national', label: 'National (All India)' },
    { label: '── Maharashtra ──', disabled: true },
    { value: 'mumbai', label: 'Mumbai' },
    { value: 'pune', label: 'Pune' },
    { value: 'nagpur', label: 'Nagpur' },
    { value: 'nashik', label: 'Nashik' },
    { value: 'aurangabad', label: 'Aurangabad' },
    { value: 'solapur', label: 'Solapur' },
  ],
  bn: [
    { value: '', label: '-- All Areas --' },
    { value: 'national', label: 'National (All India)' },
    { label: '── West Bengal ──', disabled: true },
    { value: 'kolkata', label: 'Kolkata' },
    { value: 'siliguri', label: 'Siliguri' },
  ],
};

const NEWSPAPERS_BY_LANG = {
  en: [
    { value: '', label: '-- All Newspapers --' },
    { label: '── National ──', disabled: true },
    { value: 'times_of_india', label: 'Times of India' },
    { value: 'the_hindu', label: 'The Hindu' },
    { value: 'indian_express', label: 'The Indian Express' },
    { value: 'hindustan_times', label: 'Hindustan Times' },
    { value: 'deccan_herald', label: 'Deccan Herald' },
    { value: 'economic_times', label: 'Economic Times' },
    { value: 'business_standard', label: 'Business Standard' },
    { label: '── International ──', disabled: true },
    { value: 'bbc', label: 'BBC News' },
    { value: 'reuters', label: 'Reuters' },
    { value: 'guardian', label: 'The Guardian' },
    { value: 'al_jazeera', label: 'Al Jazeera' },
    { value: 'cnn', label: 'CNN' },
  ],
  hi: [
    { value: '', label: '-- All Newspapers --' },
    { value: 'dainik_jagran', label: 'Dainik Jagran' },
    { value: 'dainik_bhaskar', label: 'Dainik Bhaskar' },
    { value: 'amar_ujala', label: 'Amar Ujala' },
    { value: 'hindustan_hindi', label: 'Hindustan (Hindi)' },
    { value: 'navbharat_times', label: 'Navbharat Times' },
    { value: 'rajasthan_patrika', label: 'Rajasthan Patrika' },
    { value: 'jansatta', label: 'Jansatta' },
  ],
  te: [
    { value: '', label: '-- All Newspapers --' },
    { value: 'eenadu', label: 'Eenadu' },
    { value: 'sakshi', label: 'Sakshi' },
    { value: 'andhrajyothy', label: 'Andhra Jyothy' },
    { value: 'namaste_telangana', label: 'Namasthe Telangana' },
    { value: 'telangana_today', label: 'Telangana Today' },
    { value: 'vaartha', label: 'Vaartha' },
    { value: 'great_andhra', label: 'Great Andhra' },
  ],
  ta: [
    { value: '', label: '-- All Newspapers --' },
    { value: 'daily_thanthi', label: 'Dina Thanthi' },
    { value: 'dinamalar', label: 'Dinamalar' },
    { value: 'dinamani', label: 'Dinamani' },
    { value: 'maalai_malar', label: 'Maalai Malar' },
  ],
  kn: [
    { value: '', label: '-- All Newspapers --' },
    { value: 'vijaya_karnataka', label: 'Vijaya Karnataka' },
    { value: 'prajavani', label: 'Prajavani' },
    { value: 'vijayavani', label: 'Vijayavani' },
    { value: 'udayavani', label: 'Udayavani' },
  ],
  ml: [
    { value: '', label: '-- All Newspapers --' },
    { value: 'malayala_manorama', label: 'Malayala Manorama' },
    { value: 'mathrubhumi', label: 'Mathrubhumi' },
    { value: 'deshabhimani', label: 'Deshabhimani' },
  ],
  mr: [
    { value: '', label: '-- All Newspapers --' },
    { value: 'lokmat', label: 'Lokmat' },
    { value: 'maharashtra_times', label: 'Maharashtra Times' },
    { value: 'pudhari', label: 'Pudhari' },
    { value: 'sakal', label: 'Sakal' },
  ],
  bn: [
    { value: '', label: '-- All Newspapers --' },
    { value: 'anandabazar', label: 'Anandabazar Patrika' },
    { value: 'bartaman', label: 'Bartaman Patrika' },
    { value: 'sangbad_pratidin', label: 'Sangbad Pratidin' },
    { value: 'telegraph_india', label: 'The Telegraph India' },
  ],
};

export default function FilterPanel({ onFilter }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const pref = user?.preferences || {};
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState({
    language: pref.newsLanguage || 'en',
    area: pref.area || 'national',
    newspaper: pref.newspaper || '',
    fromDate: '',
    keywords: pref.keywords || '',
    edition: pref.edition || 'digital',
  });

  // Reset area and newspaper when language changes
  useEffect(() => {
    setFilters(f => ({ ...f, area: 'national', newspaper: '' }));
  }, [filters.language]);

  // Sync keywords from preferences when user loads
  useEffect(() => {
    if (pref.keywords) setFilters(f => ({ ...f, keywords: pref.keywords }));
  }, [pref.keywords]);

  const areas = AREAS_BY_LANG[filters.language] || AREAS_BY_LANG['en'];
  const newspapers = NEWSPAPERS_BY_LANG[filters.language] || NEWSPAPERS_BY_LANG['en'];
  const keywordList = filters.keywords ? filters.keywords.split(',').map(k => k.trim()).filter(Boolean) : [];

  const handleSubmit = e => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const reset = { language: 'en', area: 'national', newspaper: '', fromDate: '', keywords: pref.keywords || '', edition: 'digital' };
    setFilters(reset);
    onFilter(reset);
  };

  const removeKeyword = keyword => {
    const updated = keywordList.filter(k => k !== keyword).join(', ');
    setFilters(f => ({ ...f, keywords: updated }));
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
            {/* Edition Toggle */}
            <div className={styles.editionToggle}>
              <button
                type="button"
                className={`${styles.editionBtn} ${filters.edition === 'digital' ? styles.editionActive : ''}`}
                onClick={() => setFilters(f => ({ ...f, edition: 'digital' }))}
              >
                🌐 Digital News
              </button>
              <button
                type="button"
                className={`${styles.editionBtn} ${filters.edition === 'epaper' ? styles.editionActive : ''}`}
                onClick={() => navigate('/epapers')}
              >
                📄 E-Paper
              </button>
            </div>

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
                  {areas.map((a, i) =>
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
                  {newspapers.map((n, i) =>
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

            {/* Keywords from preferences */}
            {keywordList.length > 0 && (
              <div className={styles.keywordsSection}>
                <label>🔖 Your Keywords</label>
                <div className={styles.keywords}>
                  {keywordList.map(k => (
                    <span key={k} className={styles.tag}>
                      {k}
                      <button type="button" onClick={() => removeKeyword(k)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
            )}

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

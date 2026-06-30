import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';
import styles from './Account.module.css';

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'hi', label: 'हिंदी' },
  { value: 'te', label: 'తెలుగు' },
  { value: 'ta', label: 'தமிழ்' },
  { value: 'kn', label: 'ಕನ್ನಡ' },
  { value: 'ml', label: 'മലയാളം' },
  { value: 'mr', label: 'मराठी' },
  { value: 'bn', label: 'বাংলা' },
  { value: 'gu', label: 'ગુજરાતી' },
  { value: 'pa', label: 'ਪੰਜਾਬੀ' },
];

const AREAS = [
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

const NEWSPAPERS_BY_LANG = {
  en: [
    { value: '', label: '-- No preference --' },
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
    { value: '', label: '-- No preference --' },
    { value: 'dainik_jagran', label: 'Dainik Jagran' },
    { value: 'dainik_bhaskar', label: 'Dainik Bhaskar' },
    { value: 'amar_ujala', label: 'Amar Ujala' },
    { value: 'hindustan_hindi', label: 'Hindustan (Hindi)' },
    { value: 'navbharat_times', label: 'Navbharat Times' },
    { value: 'rajasthan_patrika', label: 'Rajasthan Patrika' },
    { value: 'jansatta', label: 'Jansatta' },
  ],
  te: [
    { value: '', label: '-- No preference --' },
    { value: 'eenadu', label: 'Eenadu' },
    { value: 'sakshi', label: 'Sakshi' },
    { value: 'andhrajyothy', label: 'Andhra Jyothy' },
    { value: 'namaste_telangana', label: 'Namasthe Telangana' },
    { value: 'telangana_today', label: 'Telangana Today' },
    { value: 'vaartha', label: 'Vaartha' },
    { value: 'great_andhra', label: 'Great Andhra' },
  ],
  ta: [
    { value: '', label: '-- No preference --' },
    { value: 'daily_thanthi', label: 'Dina Thanthi' },
    { value: 'dinamalar', label: 'Dinamalar' },
    { value: 'dinamani', label: 'Dinamani' },
    { value: 'maalai_malar', label: 'Maalai Malar' },
  ],
  kn: [
    { value: '', label: '-- No preference --' },
    { value: 'vijaya_karnataka', label: 'Vijaya Karnataka' },
    { value: 'prajavani', label: 'Prajavani' },
    { value: 'vijayavani', label: 'Vijayavani' },
    { value: 'udayavani', label: 'Udayavani' },
  ],
  ml: [
    { value: '', label: '-- No preference --' },
    { value: 'malayala_manorama', label: 'Malayala Manorama' },
    { value: 'mathrubhumi', label: 'Mathrubhumi' },
    { value: 'deshabhimani', label: 'Deshabhimani' },
  ],
  mr: [
    { value: '', label: '-- No preference --' },
    { value: 'lokmat', label: 'Lokmat' },
    { value: 'maharashtra_times', label: 'Maharashtra Times' },
    { value: 'pudhari', label: 'Pudhari' },
    { value: 'sakal', label: 'Sakal' },
  ],
  bn: [
    { value: '', label: '-- No preference --' },
    { value: 'anandabazar', label: 'Anandabazar Patrika' },
    { value: 'bartaman', label: 'Bartaman Patrika' },
    { value: 'sangbad_pratidin', label: 'Sangbad Pratidin' },
    { value: 'telegraph_india', label: 'The Telegraph India' },
  ],
};

export default function Account() {
  const { user, updateUser } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [showPw, setShowPw] = useState({ old: false, new: false, confirm: false });
  const [prefs, setPrefs] = useState(user?.preferences || {});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Reset newspaper when news language changes
  useEffect(() => {
    setPrefs(p => ({ ...p, newspaper: '' }));
  }, [prefs.newsLanguage]);

  const newspapers = NEWSPAPERS_BY_LANG[prefs.newsLanguage || 'en'] || NEWSPAPERS_BY_LANG['en'];

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  const handleUpdateProfile = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/api/user/profile', { email });
      updateUser(res.data.user);
      showMsg('success', 'Profile updated successfully!');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/api/user/password', {
        oldPassword: passwords.old,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      });
      setPasswords({ old: '', new: '', confirm: '' });
      showMsg('success', 'Password changed successfully!');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Password change failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreferences = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/api/user/preferences', prefs);
      updateUser({ preferences: res.data.preferences });
      showMsg('success', 'Preferences saved!');
    } catch (err) {
      showMsg('error', err.response?.data?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.container}>
        <h1 className={styles.title}>⚙️ Account Settings</h1>

        {message.text && (
          <div className={`${styles.alert} ${message.type === 'success' ? styles.success : styles.error}`}>
            {message.type === 'success' ? '✅' : '❌'} {message.text}
          </div>
        )}

        {/* Profile */}
        <section className={styles.section}>
          <h2>👤 Profile</h2>
          <form onSubmit={handleUpdateProfile}>
            <div className={styles.field}>
              <label>Username</label>
              <input type="text" value={user?.username || ''} disabled />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              Update Profile
            </button>
          </form>
        </section>

        {/* Change Password */}
        <section className={styles.section}>
          <h2>🔒 Change Password</h2>
          <form onSubmit={handleChangePassword}>
            {[
              { key: 'old', label: 'Current Password' },
              { key: 'new', label: 'New Password' },
              { key: 'confirm', label: 'Confirm New Password' },
            ].map(({ key, label }) => (
              <div className={styles.field} key={key}>
                <label>{label}</label>
                <div className={styles.passwordWrapper}>
                  <input
                    type={showPw[key] ? 'text' : 'password'}
                    value={passwords[key]}
                    onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowPw(s => ({ ...s, [key]: !s[key] }))}
                  >
                    {showPw[key] ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit" className="btn-primary" disabled={loading}>
              Change Password
            </button>
          </form>
        </section>

        {/* Preferences */}
        <section className={styles.section}>
          <h2>📰 Preferences</h2>
          <form onSubmit={handleUpdatePreferences}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label>🌐 UI Language</label>
                <select
                  value={prefs.uiLanguage || 'en'}
                  onChange={e => setPrefs(p => ({ ...p, uiLanguage: e.target.value }))}
                >
                  {LANGUAGES.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>📰 News Language</label>
                <select
                  value={prefs.newsLanguage || 'en'}
                  onChange={e => setPrefs(p => ({ ...p, newsLanguage: e.target.value }))}
                >
                  {LANGUAGES.map(l => (
                    <option key={l.value} value={l.value}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>📍 Default Area</label>
                <select
                  value={prefs.area || 'national'}
                  onChange={e => setPrefs(p => ({ ...p, area: e.target.value }))}
                >
                  {AREAS.map((a, i) =>
                    a.disabled
                      ? <option key={i} disabled>{a.label}</option>
                      : <option key={a.value} value={a.value}>{a.label}</option>
                  )}
                </select>
              </div>
              <div className={styles.field}>
                <label>🗞️ Default Newspaper</label>
                <select
                  value={prefs.newspaper || ''}
                  onChange={e => setPrefs(p => ({ ...p, newspaper: e.target.value }))}
                >
                  {newspapers.map((n, i) =>
                    n.disabled
                      ? <option key={i} disabled>{n.label}</option>
                      : <option key={n.value} value={n.value}>{n.label}</option>
                  )}
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label>🔖 Keywords (comma-separated)</label>
              <textarea
                rows={3}
                placeholder="e.g. technology, cricket, politics"
                value={prefs.keywords || ''}
                onChange={e => setPrefs(p => ({ ...p, keywords: e.target.value }))}
              />
            </div>
            <button type="submit" className="btn-primary" disabled={loading}>
              Save Preferences
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

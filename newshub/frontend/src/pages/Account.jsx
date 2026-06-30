import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import api from '../services/api';
import styles from './Account.module.css';

export default function Account() {
  const { user, updateUser } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });
  const [prefs, setPrefs] = useState(user?.preferences || {});
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/api/user/profile', { email });
      updateUser(res.data.user);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await api.put('/api/user/password', {
        oldPassword: passwords.old,
        newPassword: passwords.new,
        confirmPassword: passwords.confirm,
      });
      setPasswords({ old: '', new: '', confirm: '' });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Password change failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePreferences = async e => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      const res = await api.put('/api/user/preferences', prefs);
      updateUser({ preferences: res.data.preferences });
      setMessage({ type: 'success', text: 'Preferences saved!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Save failed' });
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
          <div className={message.type === 'success' ? 'success-msg' : 'error-msg'}>
            {message.text}
          </div>
        )}

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
                <input
                  type="password"
                  value={passwords[key]}
                  onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                  required
                />
              </div>
            ))}
            <button type="submit" className="btn-primary" disabled={loading}>
              Change Password
            </button>
          </form>
        </section>

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
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="te">తెలుగు</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>📰 News Language</label>
                <select
                  value={prefs.newsLanguage || 'en'}
                  onChange={e => setPrefs(p => ({ ...p, newsLanguage: e.target.value }))}
                >
                  <option value="en">English</option>
                  <option value="hi">हिंदी</option>
                  <option value="te">తెలుగు</option>
                  <option value="ta">தமிழ்</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>📍 Area</label>
                <input
                  type="text"
                  value={prefs.area || ''}
                  onChange={e => setPrefs(p => ({ ...p, area: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <label>🗞️ Newspaper</label>
                <input
                  type="text"
                  value={prefs.newspaper || ''}
                  onChange={e => setPrefs(p => ({ ...p, newspaper: e.target.value }))}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label>🔖 Keywords (comma-separated)</label>
              <textarea
                rows={3}
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

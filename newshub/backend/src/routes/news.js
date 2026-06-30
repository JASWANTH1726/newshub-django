const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  fetchFromNewsAPI,
  fetchByNewspaper,
  fetchRecommendations,
  AREA_QUERY_MAP,
  NEWSPAPER_NAME_MAP,
} = require('../services/newsService');

// GET /api/news/feed
// Returns articles based on user preferences or query params
router.get('/feed', auth, async (req, res) => {
  try {
    const pref = req.user.preferences;
    const {
      query,
      newspaper = pref.newspaper,
      area      = pref.area,
      language  = pref.newsLanguage,
      fromDate,
    } = req.query;

    let articles = [];
    const areaName = AREA_QUERY_MAP[area] || 'India';
    const keywords = pref.keywords
      ? pref.keywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];

    if (query) {
      articles = await fetchFromNewsAPI({ query, language, fromDate });
    } else if (newspaper) {
      articles = await fetchByNewspaper(newspaper, area, language, fromDate);
      if (!articles.length) {
        const q = keywords.length ? keywords.join(' OR ') : areaName;
        articles = await fetchFromNewsAPI({ query: q, language, fromDate });
      }
    } else {
      const q = keywords.length ? keywords.join(' OR ') : areaName;
      articles = await fetchFromNewsAPI({ query: q, language, fromDate });
    }

    res.json({
      articles,
      activeNewspaper: NEWSPAPER_NAME_MAP[newspaper] || '',
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/news/recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const pref = req.user.preferences;
    const keywords = pref.keywords
      ? pref.keywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];
    const articles = await fetchRecommendations(keywords, pref.area, pref.newsLanguage);
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/news/meta  — send area/newspaper maps to frontend
router.get('/meta', (req, res) => {
  res.json({ AREA_QUERY_MAP, NEWSPAPER_NAME_MAP });
});

module.exports = router;

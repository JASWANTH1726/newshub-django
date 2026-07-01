const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  fetchFromNewsAPI,
  fetchByNewspaper,
  fetchByAreaAndLanguage,
  fetchRecommendations,
  AREA_QUERY_MAP,
  NEWSPAPER_NAME_MAP,
} = require('../services/newsService');

// GET /api/news/feed
router.get('/feed', auth, async (req, res) => {
  try {
    const pref = req.user.preferences;
    const {
      query,
      newspaper = pref.newspaper || '',
      area      = pref.area || 'national',
      language  = pref.newsLanguage || 'en',
      fromDate,
      edition   = pref.edition || 'digital',
      keywords  = pref.keywords || '',
    } = req.query;

    const keywordList = keywords
      ? keywords.split(',').map(k => k.trim()).filter(Boolean)
      : [];

    let articles = [];

    // 1. Direct search query takes highest priority
    if (query && query.trim()) {
      const areaName = AREA_QUERY_MAP[area] || 'India';
      const searchQuery = `${query.trim()} ${areaName}`;
      articles = await fetchFromNewsAPI({ query: searchQuery, language, fromDate });
    }
    // 2. Specific newspaper selected
    else if (newspaper) {
      articles = await fetchByNewspaper(newspaper, area, language, fromDate);
      // If RSS/newspaper fetch returns nothing, fall back to area+keywords
      if (!articles.length) {
        articles = await fetchByAreaAndLanguage(area, language, keywordList, fromDate);
      }
    }
    // 3. Area + language + keywords
    else {
      articles = await fetchByAreaAndLanguage(area, language, keywordList, fromDate);
    }

    res.json({
      articles,
      activeNewspaper: NEWSPAPER_NAME_MAP[newspaper] || '',
      totalResults: articles.length,
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
    if (!keywords.length) return res.json({ articles: [] });
    const articles = await fetchRecommendations(keywords, pref.area, pref.newsLanguage);
    res.json({ articles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/news/meta
router.get('/meta', (req, res) => {
  res.json({ AREA_QUERY_MAP, NEWSPAPER_NAME_MAP });
});

module.exports = router;

const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'API ARYN online!',
        status: 'OK'
    });
});

module.exports = router;
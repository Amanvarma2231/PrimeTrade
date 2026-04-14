const express = require('express');
const {
    getAssets,
    getAsset,
    addAsset,
    updateAsset,
    deleteAsset
} = require('../../controllers/portfolio');

const router = express.Router();

const { protect, authorize } = require('../../middleware/auth');

router.use(protect); // Protect all routes below

router
    .route('/')
    .get(getAssets)
    .post(addAsset);

router
    .route('/:id')
    .get(getAsset)
    .put(updateAsset)
    .delete(deleteAsset);

module.exports = router;

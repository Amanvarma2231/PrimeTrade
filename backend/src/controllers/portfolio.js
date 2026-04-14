const { Portfolio } = require('../models/index')();

// @desc    Get all portfolio assets
// @route   GET /api/v1/portfolio
// @access  Private
exports.getAssets = async (req, res, next) => {
    try {
        let query;

        // If admin, can see all (optional feature), but here we filter by user unless specified
        if (req.user.role === 'admin') {
            query = Portfolio.find().populate('user', 'username email');
        } else {
            query = Portfolio.find({ user: req.user.id });
        }

        const assets = await query;

        res.status(200).json({
            success: true,
            count: assets.length,
            data: assets
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Get single asset
// @route   GET /api/v1/portfolio/:id
// @access  Private
exports.getAsset = async (req, res, next) => {
    try {
        const asset = await Portfolio.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({ success: false, error: 'Asset not found' });
        }

        // Make sure user is owner
        if (asset.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        res.status(200).json({ success: true, data: asset });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Add asset
// @route   POST /api/v1/portfolio
// @access  Private
exports.addAsset = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.user = req.user.id;

        const asset = await Portfolio.create(req.body);

        res.status(201).json({
            success: true,
            data: asset
        });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Update asset
// @route   PUT /api/v1/portfolio/:id
// @access  Private
exports.updateAsset = async (req, res, next) => {
    try {
        let asset = await Portfolio.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({ success: false, error: 'Asset not found' });
        }

        // Make sure user is owner
        if (asset.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        asset = await Portfolio.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: asset });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

// @desc    Delete asset
// @route   DELETE /api/v1/portfolio/:id
// @access  Private
exports.deleteAsset = async (req, res, next) => {
    try {
        const asset = await Portfolio.findById(req.params.id);

        if (!asset) {
            return res.status(404).json({ success: false, error: 'Asset not found' });
        }

        // Make sure user is owner
        if (asset.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(401).json({ success: false, error: 'Not authorized' });
        }

        await asset.deleteOne();

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        res.status(400).json({ success: false, error: err.message });
    }
};

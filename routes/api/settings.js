const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');

//Setting Model
const Setting = require('../../models/Setting');
//User Model
const User = require('../../models/User');

// @route   GET api/settings
// @desc    Get All Setting
// @access  Public
router.get('/', (req, res) => {
    Setting.find().then(settings => res.json(settings[0]))
});

// @route   POST api/settings
// @desc    Edit Settings
// @access  Private
router.post('/', auth, (req, res) => {
    const { myVision, headerColorText, headerHoverColorText, headerColorTop, headerColorBottom,
        headerImage, bgImage, coverBookImage } = req.body;

    User.findById(req.user.id).then(user => {
        if (!user.admin) {
            return res.status(400).json({ msg: 'No permission' });
        }

        var newSetting = {
            myVision, headerColorText, headerHoverColorText, headerColorTop, headerColorBottom,
            headerImage, bgImage, coverBookImage
        };
        var cleanSetting = {}
        for (var key in newSetting){
            if(newSetting[key] !== undefined){
                cleanSetting[key] = newSetting[key];
            }
          }
        Setting.find().then(setting =>
            setting[0].updateOne(cleanSetting).then(() => {
                Setting.find().then(settings => res.json(settings[0]))
            })
        ).catch(err => res.status(404).json({ success: false }));
    })
});

// @route   POST api/settings/bgimage
// @desc    Edit A BackGround Image
// @access  Private
router.post('/settings/bgimage', auth, (req, res) => {

    User.findById(req.user.id).then(user => {
        if (!user.admin) {
            return res.status(400).json({ msg: 'No permission' });
        }

        const { bgImage } = req.body;

        //Simple validation
        if (!bgImage) {
            return res.status(400).json({ msg: 'Please enter background image' });
        }

        var newSetting = {
            bgImage
        };

        Setting.find().then(setting =>
            setting.updateOne(newSetting).then(() => {
                Setting.find().then(settings => res.json(settings[0]))
            })
        ).catch(err => res.status(404).json({ success: false }));
    })
});

// @route   POST api/settings/myvision
// @desc    Edit A BackGround Image
// @access  Private
router.post('/settings/myvision', auth, (req, res) => {

    User.findById(req.user.id).then(user => {
        if (!user.admin) {
            return res.status(400).json({ msg: 'No permission' });
        }

        const { myVision } = req.body;

        //Simple validation
        if (!myVision) {
            return res.status(400).json({ msg: 'Please enter your vision' });
        }

        var newSetting = {
            myVision
        };

        Setting.find().then(setting =>
            setting.updateOne(newSetting).then(() => {
                Setting.find().then(settings => res.json(settings[0]))
            })
        ).catch(err => res.status(404).json({ success: false }));
    })
});

module.exports = router;
const express = require('express')
const router = express.Router()
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')
const Post = require('../../models/Post')

const request = require('request')
const config = require('config')
const { check, validationResult } = require('express-validator')

// @route : GET /api/profile/me
// desc   : Profile for current user
// access : Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id,
    }).populate('User', ['name', 'avatar'])
    if (!profile) {
      return res.status(400).json({ msg: 'no profile for this user' })
    }
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})

// @route : POST /api/profile
// desc   : create or update profile for a user
// access : Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status should not be empty').not().isEmpty(),
      check('skills', 'skill should not be empty').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      company,
      website,
      location,
      skills,
      status,
      bio,
      githubusername,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body

    //Build profile object
    const profileFields = {}
    profileFields.user = req.user.id //just filling up that profileField object
    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (bio) profileFields.bio = bio
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim())
    }

    profileFields.social = {}
    if (facebook) profileFields.social.facebook = facebook
    if (youtube) profileFields.social.youtube = youtube
    if (instagram) profileFields.social.instagram = instagram
    if (twitter) profileFields.social.twitter = twitter
    if (linkedin) profileFields.social.linkedin = linkedin

    try {
      let profile = await Profile.findOne({ user: req.user.id })
      if (profile) {
        //update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )
        return res.json(profile)
      }

      //create
      profile = new Profile(profileFields)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
    }
  }
)

// @route : GET /api/profile
// desc   : get all profiles
// access : Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])
    if (!profiles) {
      res.json(400).json({ msg: 'There is no profiles in database' })
    }
    res.json(profiles)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})

// @route : GET /api/profile/user/user_id
// desc   : get profile by user's id
// access : Public
router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar'])
    if (!profile) {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user's id" })
    }
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    if (err.kind == 'ObjectId') {
      return res
        .status(400)
        .json({ msg: "There is no profile for this user's id" })
    }
    res.status(500).send('Server Error')
  }
})

// @route : DELETE /api/profile
// desc   : delete profile, it's user and user' post
// access : Private
router.delete('/', auth, async (req, res) => {
  try {
    //delete post
    await Post.deleteMany({ user: req.user.id })
    //delete profile
    await Profile.findOneAndRemove({ user: req.user.id })

    //delete user
    await User.findOneAndRemove({ _id: req.user.id })

    res.json({ msg: 'profile deleted' })
  } catch (err) {
    console.error(err.message)
  }
})

// @route : PUT /api/profile/experience
// desc   : Add experience in profile of user
// access : Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'title is required').not().isEmpty(),
      check('company', 'company is required').not().isEmpty(),
      check('from', 'from date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    } = req.body
    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.experience.unshift(newExp)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('server error')
    }
  }
)

// @route : DELETE /api/profile/experience/exp_id
// desc   : Delete experience
// access : Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    //Get remove index
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id)

    profile.experience.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})

// @route : PUT /api/profile/education
// desc   : Add education in profile of user
// access : Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'degree is required').not().isEmpty(),
      check('fieldofstudy', 'fieldofstudy is required').not().isEmpty(),
      check('from', 'from date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    } = req.body
    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    }
    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.education.unshift(newEdu)
      await profile.save()
      res.json(profile)
    } catch (err) {
      console.error(err.message)
      res.status(500).send('server error')
    }
  }
)

// @route : DELETE /api/profile/education/edu_id
// desc   : Delete education
// access : Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })
    //Get remove index
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id)

    profile.education.splice(removeIndex, 1)
    await profile.save()
    res.json(profile)
  } catch (err) {
    console.error(err.message)
    res.status(500).send('server error')
  }
})

// @route : GET /api/profile/github/:username
// desc   : Get repos from github
// access : Public
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:dsc&client_id=${config.get(
        'githubClientId'
      )})&client_secret=${config.get('githubClientSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    }

    request(options, (error, response, body) => {
      if (error) console.error(error)

      res.json(JSON.parse(body))
    })
  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server Error')
  }
})
module.exports = router

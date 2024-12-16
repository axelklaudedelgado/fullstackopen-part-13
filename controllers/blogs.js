const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { Op } = require('sequelize')

const { SECRET } = require('../util/config')
const { Blog } = require('../models')
const { User } = require('../models')

const blogFinder = async (req, res, next) => {
  req.blog = await Blog.findByPk(req.params.id)
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
    } catch (error) {
      return res.status(401).json({ error: error.message })
    }
  }  else {
    return res.status(401).json({ error: 'token missing' })
  }

  next()
}

router.get('/', async (req, res) => {
  const where = {}

  if (req.query.search) {
    const searchQuery = req.query.search.trim()

    where[Op.or] = [
      { title: { [Op.iLike]: `%${searchQuery}%` } },  
      { author: { [Op.iLike]: `%${searchQuery}%` } }
    ]
  }

  const blogs = await Blog.findAll({
    attributes: { exclude: ['userId'] },
    include: {
      model: User,
      attributes: ['name']
    },
    where,
    order: [
      ['likes', 'DESC'],
    ]
  })
  res.json(blogs)
})

router.post('/', tokenExtractor, async (req, res) => {
  const user = await User.findByPk(req.decodedToken.id)
  const blog = await Blog.create({...req.body, userId: user.id, date: new Date()})
  return res.json(blog)
})

router.delete('/:id', tokenExtractor, blogFinder, async (req, res) => {
  if (req.blog) {
    if(req.decodedToken.id === req.blog.userId)  {
      await req.blog.destroy()
    }
  }
  res.status(204).end()
})

router.put('/:id', blogFinder, async (req, res) => {
  if (req.blog) {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
  } else {
    res.status(404).end()
  }
})


module.exports = router
/* eslint-disable eqeqeq */
/* eslint-disable prefer-const */
/* eslint-disable prettier/prettier */
const express = require('express')
const methodOverride = require('method-override')
const _ = require('lodash')
const lodashId = require('lodash-id')
const low = require('lowdb')
const Memory = require('lowdb/adapters/Memory')
const FileSync = require('lowdb/adapters/FileSync')
const bodyParser = require('../body-parser')
const validateData = require('./validate-data')
const plural = require('./plural')
const nested = require('./nested')
const singular = require('./singular')
const mixins = require('../mixins')

module.exports = (db, opts) => {
  opts = Object.assign({ foreignKeySuffix: 'Id', _isFake: false }, opts)

  if (typeof db === 'string') {
    db = low(new FileSync(db))
  } else if (!_.has(db, '__chain__') || !_.has(db, '__wrapped__')) {
    db = low(new Memory()).setState(db)
  }

  // Create router
  const router = express.Router()

  // Add middlewares
  router.use(methodOverride())
  router.use(bodyParser)

  validateData(db.getState())

  // Add lodash-id methods to db
  db._.mixin(lodashId)

  // Add specific mixins
  db._.mixin(mixins)

  // Expose database
  router.db = db

  // Expose render
  router.render = (req, res) => {
    res.jsonp(res.locals.data)
  }


  // GET /db
  router.get('/db', (req, res) => {
    res.jsonp(db.getState())
  })

  // POST /login
  router.post('/login', (req, res) => {
    let profile = db.getState().profiles.filter(x => x.email == req.body.email)[0];

      // eslint-disable-next-line prettier/prettier
      if(profile) {
        // Should use hashing
        if(profile.password == req.body.password) {
          res.status(200);
          res.send(profile);
        } else {
          res.status(401);
          res.send("Password incorrect");
        }
      } else {
        res.status(401);
        res.send("Profile not found");
      }

    })

  // Handle /:parent/:parentId/:resource
  router.use(nested(opts))

  // Create routes
  db.forEach((value, key) => {
    if (_.isPlainObject(value)) {
      router.use(`/${key}`, singular(db, key, opts))
      return
    }

    if (_.isArray(value)) {
      router.use(`/${key}`, plural(db, key, opts))
      return
    }

    const sourceMessage = ''
    // if (!_.isObject(source)) {
    //   sourceMessage = `in ${source}`
    // }

    const msg =
      `Type of "${key}" (${typeof value}) ${sourceMessage} is not supported. ` +
      `Use objects or arrays of objects.`

    throw new Error(msg)
  }).value()

  router.use((req, res) => {
    if (!res.locals.data) {
      res.status(404)
      res.locals.data = {}
    }

    router.render(req, res)
  })

  router.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(err.stack)
  })

  return router
}

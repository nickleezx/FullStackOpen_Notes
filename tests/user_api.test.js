const bcrypt = require('bcrypt')
const User = require('../models/user')
const helper = require('./test_helper')
const app = require('../app')
const supertest = require('supertest')
const mongoose = require('mongoose')
const assert = require('node:assert')
const {test, after, beforeEach, describe} = require('node:test')

const api = supertest(app)

describe('where there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash})

    await user.save()
  })

  test('creation succeeds witha fresh username', async () => {
    console.log('creating test')
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: 'nickleezx',
      name: 'Nick',
      password: 'test_password'
    }
    
    await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
    console.log('api done')
    
    const usersAtEnd = await helper.usersInDb()
    console.log('helper done')
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
    
    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
    console.log('done')
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'test_password',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()

    assert(result.body.error.includes('expected `username` to be unique'))
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  after(async () => {
    await mongoose.connection.close()
  })
})

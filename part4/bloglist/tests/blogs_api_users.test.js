const bcrypt = require('bcryptjs')
const User = require('../models/users')
const helper = require('./test_helper')
const app = require('../index')
const supertest = require('supertest')
const api = supertest(app)

describe('when there is initially one user in db', () => {

  beforeEach(async () => {
    await User.deleteMany({})
    const password = 'sekret';
    const username = 'root';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password , saltRounds)
    const user = new User({ username, passwordHash })

    await user.save()
   
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)


    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })


  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if  username has invalid length.', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ja',
      name: 'Jawad',
      password: 'abc123',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Username should be atleast three characters long.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

  test('creation fails with proper statuscode and message if  password has invalid length.', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'jawad12345',
      name: 'Jawad',
      password: 'ab',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Password length should be atleast three characters long.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })
})
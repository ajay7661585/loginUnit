const request = require('supertest')
const makeApp = require('./app')
//const { jest } = require('@jest/globals')

const createUser = jest.fn()
const getUser = jest.fn()

const app = makeApp({
  createUser,
  getUser
})

describe("POST /users", () => {

  beforeEach(() => {
    createUser.mockReset()
    createUser.mockResolvedValue(0)
  })

  describe("given a username and password", () => {
    test("should save the username and password to the database", async () => {
      const bodyData = [
        {username: "akgupta", password: "Ajay@99880"},
        {username: "bkgupta", password: "Bjay@99880"},
        {username: "ckgupta", password: "Cjay@99880"},
      ]
      for (const body of bodyData) {
        createUser.mockReset()
        await request(app).post("/users").send(body)
        expect(createUser.mock.calls.length).toBe(1)
        expect(createUser.mock.calls[0][0]).toBe(body.username)
        expect(createUser.mock.calls[0][1]).toBe(body.password)
      }
    })

    test("Respond With Json ID", async () => {
      for (let i = 0; i < 10; i++) {
        createUser.mockReset()
        createUser.mockResolvedValue(i)
        const response = await request(app).post("/users").send({ username: "username", password: "password" })
        expect(response.body.userId).toBe(i)
      }
    })

    test("Status Code 200", async () => {
      const response = await request(app).post("/users").send({
        username: "username",
        password: "password"
      })
      expect(response.statusCode).toBe(200)
    })
    test("Content specify header type", async () => {
      const response = await request(app).post("/users").send({
        username: "username",
        password: "password"
      })
      expect(response.headers['content-type']).toEqual(expect.stringContaining("json"))
    })
    test("response has userId", async () => {
      const response = await request(app).post("/users").send({
        username: "username",
        password: "password"
      })
      expect(response.body.userId).toBeDefined()
    })
  })

  describe("When required field is missing get 400 error", () => {
    test("Status code of 400", async () => {
      const bodyData = [
        {username: "username"},
        {password: "password"},
        {}
      ]
      for (const body of bodyData) {
        const response = await request(app).post("/users").send(body)
        expect(response.statusCode).toBe(400)
      }
    })
  })

})
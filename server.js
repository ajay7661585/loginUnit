const database = require('./database.js')
const makeApp = require('./app.js')

const app = makeApp(database)

app.listen(8080, () => console.log("listening on port 8080"))
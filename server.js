const express = require('express')
const app = express()

const PORT = 80;

app.disable('x-powered-by')
app.use(express.json())

app.get('/', (req, res) => {
    res.status(200).send("hello world")
})

app.listen(PORT, () => {
    console.log("listening on port " + PORT)
})

const express = require('express')
const app = express()
const path = require('path')

app.use(express.json());

// Database connection
// const db = require('./db')

// Routes
// const notesRoute = require('./routes/NotesRoute')
// const contributeRoute = require('./routes/ContributeRoute')


// app.use('/api',notesRoute)
// app.use('/api', contributeRoute)


app.get('/', (req, res) => {
    res.send("App running")
})


var server_port = process.env.YOUR_PORT || process.env.PORT || 8080;
var server_host = process.env.YOUR_HOST || '0.0.0.0';

app.listen(server_port, () => console.log(`Listening on port ${server_port}`))
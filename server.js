const express = require('express')
const fs = require('fs')
const cors = require('cors')
const path = require('path')
const morgan = require('morgan')
const mongoose = require('mongoose')

const db = require('./config/keys').mongoURI
const corsOption = require('./middleware/cors')
const logs = require('./middleware/logs')

const userRoutes = require('./routes/api/Users')
const cartRoutes = require('./routes/api/Cart')
const storeRoutes = require('./routes/api/Store')
const productRoutes = require('./routes/api/Product')
const reviewRoutes = require('./routes/api/Review')
const orderRoutes = require('./routes/api/Order')

const app = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(morgan(':method :url :status :response-time ms', {
    stream: fs.createWriteStream(path.join(__dirname, 'logs'))
}))

app.use(cors(corsOption))

mongoose.connect(db, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true, 
    useFindAndModify: false
}, () => {
    console.log('mongoDB connected')
})

app.use('/api/users', userRoutes)
app.use('/api/cart', cartRoutes)
app.use('/api/store', storeRoutes)
app.use('/api/product', productRoutes)
app.use('/api/review', reviewRoutes)
app.use('/api/order', orderRoutes)

app.get('/logs', logs.log)

app.listen(port, () => console.log(`Server running on port ${port}`))
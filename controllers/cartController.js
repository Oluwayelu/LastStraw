const User = require('../models/User')
const Product = require('../models/Product')
const Cart = require('../models/Cart')

exports.createCart = (req, res) => {
    const { id, email } = req.user

    User.findOne({ email })
        .then(user => {
            if(user.userType !== 'User') return res.status(400).json({ success: false, msg: 'Admin cannot create cart' })

            const newCart = new Cart(req.body)
            newCart.userId = id
            let productId = [], storeId = []
            newCart.products.forEach(product => {
                productId.push(product.productId)
                storeId.push(product.storeId)
            })
            console.log(productId)
            Product.find({ _id: productId, storeId })
                .then((productDetail => {

                    newCart.save()
                        .then(() => res.status(200).json({ success: true, msg: 'Cart created', productDetail }))
                        .catch(err => res.status(400).json({ success: false, msg: 'Cart could not be created', err}))
                }))
                .catch(err => res.status(400).json({ success: false, msg: 'Product does not exist', err }))
        })
        .catch(() => res.status(400).json({ success: false, msg: 'User does not exist' }))
}

exports.getCart = (req, res) => {
    const { id } = req.params
    const { email } = req.user
    
    User.findOne({ email })
        .then(user => {
            if(!user) return res.status(400).json({ success: false, msg: 'User not found '})

            Cart.findById(id)
                .populate('products.productId')
                .populate('products.storeId')
                .then(cart => {
                    if(!cart) return res.status(400).json({ success: false, msg: 'Cart does not exist' })

                    res.status(200).json({ success: true, cart })
                })
                .catch(() => res.status(400).json({ success: false, msg: 'cart could not be created' }))
        })
}

exports.updateCart = (req, res) => {
    const { id } = req.params
    const { email } = req.user
    
    User.findOne({ email })
        .then(user => {
            if(user.userType !== 'Admin') return res.status(400).json({ success: false, msg: 'User is not an admin' })

            Cart.findOneAndUpdate(
                { _id: id }, 
                req.body, 
                { new: true})
                .then(cart => {
                    if(!cart) return res.status(400).json({ success: false, msg: 'Cart does not exist' })
        
                    res.status(200).json({ success: true, msg: 'Cart updated' })
                })
                .catch(() => res.status(400).json({ success: false, msg: 'Could not update cart'}))
        })
}

exports.deleteCart = (req, res) => {
    const { id } = req.params
    const { email } = req.user
    
    User.findOne({ email })
        .then(user => {
            if(user.userType !== 'Admin') return res.status(400).json({ success: false, msg: 'User is not an admin' })

            Cart.findOneAndDelete({ _id: id })
            .then(cart => {
                if(!cart) return res.status(400).json({ success: false, msg: 'Cart does not exist' })
    
                res.status(200).json({ success: true, msg: 'Cart has been deleted' })
            })
            .catch(() => res.status(400).json({ success: false, msg: 'Could not delete cart'}))
        })   
}
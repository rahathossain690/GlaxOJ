const fs = require('fs')
const router = require('express').Router()

// its magic

fs.readdirSync(__dirname).filter(file => {
    return file.length > 9 && file.slice(-9 === '.route.js')
}).forEach(file => {
    const route = file.split('.')[0]
    const route_function = require('./' + file)
    router.use('/' + route, route_function)
})

module.exports = router
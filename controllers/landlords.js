const Landlord = require('../models/landlord')

module.exports.renderRegister = (req, res) => {
    res.render('landlords/register')
}


module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body
        const landlord = new Landlord({ email, username })
        const registeredLandlord = await Landlord.register(landlord, password)
        req.login(registeredLandlord, err => {
            if (err) return next(err)
            req.flash('success', 'مالک گرامی به کجابریم خوش آمدید!')
            // redirect be koja konim ?
            res.redirect('/')
        })
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/landlords/register')
    }
}



module.exports.renderLogin = (req, res) => {
    res.render('landlords/login')
}

module.exports.login = async (req, res) => {
    req.flash('success', 'خوش برگشتین!')
    // redirect be koja ?
    const redirectUrl = req.session.returnTo || '/'
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

// module.exports.renderLandlord = async (req, res) => {
//     const { id } = req.params
//     const landlord = await User.findById(id)
//     res.render('landlords/show', { landlord })
// }


module.exports.logout = (req, res) => {
    req.logOut()
    req.flash('success', 'خدانگهدار!')
    // test kon bebin dorost mire ?
    res.redirect('/landlords/register')
}



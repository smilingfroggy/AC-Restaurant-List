module.exports = {
  authenticator: (req, res, next) => {
    if (!req.isAuthenticated()) {
      req.flash('warning_msg', '請先登入')
      return res.redirect('/users/login')
    }
    console.log('auth: still login')
    return next()
  }
}
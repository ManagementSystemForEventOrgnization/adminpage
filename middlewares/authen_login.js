module.exports = async (req, res, next) => {
    // req.user chi luu id cua user login
    if (!req.user) {
        res.locals = {
            title: 'Login',
            message: 'Bạn chưa đăng nhập vui lòng đăng nhập',
            layout: 'layout'
          };
        res.render('login', { });
        // res.status(601).json({ error: { message: 'Unauthorized', code: 401 } });
        return;
    } else {
        return next();
    }
}
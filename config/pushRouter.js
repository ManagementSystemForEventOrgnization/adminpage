module.exports = app =>{
    app.use('/', require('../router/index.router'));
    app.use('/api', require('../router/api.post.router'));
    app.use('/api', require('../router/api.get.router'));
    app.use('/api/datatable', require('../router/getDataTable'));

}
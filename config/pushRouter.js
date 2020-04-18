module.exports = app =>{
    app.use('/', require('../router/index.router'));
    app.use('/api', require('../router/api.router'));
    
    app.use('/api/datatable', require('../router/getDataTable'));

}
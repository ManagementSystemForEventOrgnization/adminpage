const key = require('../config/key');

module.exports = {
    formatDate: (date) => {
        let D = new Date(date);

        return `${D.getDate()}/${+D.getMonth() + 1}/${D.getFullYear()}`;
    },

    formatCurrency : (data)=>{

        let temp = (''+data).replace(/[,]/g, "");

        return temp.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    }

}
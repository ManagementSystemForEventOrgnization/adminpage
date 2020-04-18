module.exports = {
    formatDate: (date) => {
        let D = new Date(date);

        return `${D.getDate()}/${+D.getMonth() + 1}/${D.getFullYear()}`;
    },

}
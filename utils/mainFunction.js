const key = require('../config/key');

const sendNotification = function (data) {
    var headers = {
        "Content-Type": "application/json; charset=utf-8",
        "Authorization": `Basic ${key.push_rest_key}`
    };

    var options = {
        host: "onesignal.com",
        port: 443,
        path: "/api/v1/notifications",
        method: "POST",
        headers: headers
    };

    var https = require('https');
    var req = https.request(options, function (res) {
        res.on('data', function (data) {
            console.log("Response:");
            console.log(JSON.parse(data));
        });
    });

    req.on('error', function (e) {
        console.log("ERROR:");
        console.log(e);
    });

    req.write(JSON.stringify(data));
    req.end();
}

module.exports = {
    formatDate: (date) => {
        let D = new Date(date);

        return `${D.getDate()}/${+D.getMonth() + 1}/${D.getFullYear()}`;
    },

    send_notification: (data) => {
    
        var message = {
            app_id: key.push_key,
            contents: { "en": `${data}` },
            include_player_ids: ["6392d91a-b206-4b7b-a620-cd68e32c3a76","76ece62b-bcfe-468c-8a78-839aeaa8c5fa","8e0f21fa-9a5a-4ae7-a9a6-ca1f24294b86"]
            //included_segments: ["All"]
        };

        sendNotification(message);
    }






}
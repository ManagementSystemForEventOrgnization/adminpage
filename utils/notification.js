const { push_key, push_rest_key } = require('../config/key');
const OneSignal = require('onesignal-node');
const client = new OneSignal.Client(push_key, push_rest_key);


module.exports = {
    create_notification: async (data) => {
        const notification = {
            contents: {
                'en': data,
            },
            included_segments: ["All"]
            // "include_player_ids": ["2827de91-c8db-4874-9a2f-280ebd22cde1"],
        };

            // filters: [
            //     { field: 'tag', key: 'id', relation: '!=', value: 123 }
            // ]
        try {
            const response = await client.createNotification(notification);
            return response.body;
        } catch (e) {
            if (e instanceof OneSignal.HTTPError) {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
            }
        }

    },

    edit_device: async (id,name) => {
        const response = await client.editDevice(id, {
            tags: { name: name }
        });
        return response;
    },

    get_all_user: async()=>{
        const response = await client.viewDevices({ limit: 200, offset: 0 });
        return response.body;
    }
}
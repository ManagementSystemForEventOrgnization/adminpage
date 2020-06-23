const { push_key, push_rest_key } = require('../config/key');
const OneSignal = require('onesignal-node');
const client = new OneSignal.Client(push_key, push_rest_key);


module.exports = {
    create_notification: async (data) => {
        const notification = {
            contents: {
                'en': data,
            },
            included_segments: ['All'],
            filters: [
                { field: 'tag', key: 'id', relation: '!=', value: 123 }
            ]
        };

        try {
            const response = await client.createNotification(notification);
            console.log(response.body);
        } catch (e) {
            if (e instanceof OneSignal.HTTPError) {
                // When status code of HTTP response is not 2xx, HTTPError is thrown.
                console.log(e.statusCode);
                console.log(e.body);
            }
        }

    },

    edit_device: async (id) => {
        const response = await client.editDevice(id, {
            identifier: 'id2',
            tags: { id: '123' }
        });
        console.log(response.body);
        return response;

    },
    get_all_user: async()=>{
        const response = await client.viewDevices({ limit: 200, offset: 0 });
        return response.body;
    }
}
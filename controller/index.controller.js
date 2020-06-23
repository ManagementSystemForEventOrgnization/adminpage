const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = mongoose.model('users');
const Event = mongoose.model('event');
const ApplyEvent = mongoose.model('applyEvent');


module.exports = {
  home: async (req, res, next) => {
    res.locals = {
      title: 'Event',
      message: 'This is a message',
      Ten: 'sang',
      mUserId: 'NULL',
      Active: 'home'
    };
    // send_notification('Test thong baos 1')
    res.render('home', {
      // additional locals, a custom layout, or other options can be defined here
    });
  },
  event: async (req, res, next) => {
    res.locals = {
      title: 'Event',
      message: 'This is a message',
      Ten: 'sang',
      mUserId: 'NULL',
      Active: '.event'
    };

    res.render('event', {
      // additional locals, a custom layout, or other options can be defined here
    });
  },

  user: async (req, res, next) => {
    res.locals = {
      title: 'Event',
      message: 'This is a message',
      Ten: 'sang',
      mUserId: 'NULL',
      Active: '.user'
    };

    res.render('users', {
      // additional locals, a custom layout, or other options can be defined here
    });
  },

  Account: async (req, res, next) => {
    res.locals = {
      title: 'Người dùng',
      message: 'This is a message',
      Ten: 'sang',
      mUserId: 'NULL',
      Active: '.account #dashboard'
    };

    res.render('Setting/account', {
      // additional locals, a custom layout, or other options can be defined here
    });
  },
  traTienKhach: async (req, res, next) => {
    res.locals = {
      title: 'Người dùng',
      message: 'This is a message',
      Ten: 'sang',
      mUserId: 'NULL',
      Active: '.tra_tien_khach #products'
    };

    res.render('ThongKe/traTienKhach', {
      // additional locals, a custom layout, or other options can be defined here
    });
  },
  Branch: async (req, res, next) => {
    res.locals = {
      title: 'Người dùng',
      message: 'This is a message',
      Ten: 'sang',
      mUserId: 'NULL',
      Active: '.brancch #dashboard'
    };

    res.render('Setting/branch', {
      // additional locals, a custom layout, or other options can be defined here
    });
  },
  Department: async (req, res, next) => {
    res.locals = {
      title: 'Người dùng',
      message: 'This is a message',
      Ten: 'sang',
      mUserId: 'NULL',
      Active: '.department #dashboard'
    };

    res.render('Setting/department', {
      // additional locals, a custom layout, or other options can be defined here
    });
  },

  eventCategory: async (req, res, next) => {
    res.locals = {
      title: 'Event category',
      message: 'This is a message',
      Ten: 'sang',
      mUserId: 'NULL',
      Active: '.event_category'
    };

    res.render('eventCategory', {
      // additional locals, a custom layout, or other options can be defined here
    });
  },

  listApplyEvent: async (req, res, next) => {
    let id = req.params.id; // đây là id của event .

    if (!id) {
      // thong bao loi cho nguoi dung chua co ai vao.
      return next({ error: { message: 'Sự kiện không tồn tại' } });
    }
    // check xem id nay có trên db hay không.
    try {
      let event = await Event.findById(id);
      if (!event) {
        // thông báo ra là id nay không tồn tại.
      } else {
        res.locals = {
          title: 'ApplyEvent',
          message: 'This is a message',
          Ten: 'sang',
          mUserId: 'NULL',
          Active: '.event'
        };
        res.render('applyEvent', {
          event: event
          // additional locals, a custom layout, or other options can be defined here
        });
      }
    } catch (error) {

    }
  },


  listApplyEventCancel: async (req, res, next) => {
    let id = req.params.id; // đây là id của event .

    if (!id) {
      // thong bao loi cho nguoi dung chua co ai vao.
      return next({ error: { message: 'Sự kiện không tồn tại' } });
    }
    // check xem id nay có trên db hay không.
    try {
      let event = await ApplyEvent.aggregate([
        { $match: { eventId: ObjectId(id), session } },
        {
          $lookup: {
            from: 'payments',
            localField: 'session.paymentId',
            foreignField: '_id',
            as: 'payment'
          }
        }
      ]);


      if (!event) {
        // thông báo ra là id nay không tồn tại.
      } else {
        res.locals = {
          title: 'ApplyEventCancel',
          message: 'This is a message',
          Ten: 'sang',
          mUserId: 'NULL',
          Active: '.tra_tien_khach #products'
        };
        res.render('applyEvent', {
          event: event
          // additional locals, a custom layout, or other options can be defined here
        });
      }
    } catch (error) {

    }
  },

  login: async (req, res, next) => {
    res.locals = {
      title: 'ApplyEvent',
      message: 'This is a message',
      layout: 'layout'
    };
    res.render('login', {
    })
  }
};
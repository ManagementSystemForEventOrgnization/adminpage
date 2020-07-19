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
  approve_event: async (req, res, next) => {
    res.locals = {
      title: 'approve_event',
      message: 'This is a message',
      Ten: 'sang',
      mUserId: 'NULL',
      Active: '.approve_event'
    };

    res.render('approve_event', {
      // additional locals, a custom layout, or other options can be defined here
    });
  },
  require_edit_event: async (req, res, next) => {
    res.locals = {
      title: 'require_edit_event',
      message: 'This is a message',
      Ten: 'sang',
      mUserId: 'NULL',
      Active: '.require_edit_event'
    };

    res.render('require_edit', {
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
      let event = await Event.findById(id);

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
        res.render('ThongKe/applyEventCancel', {
          event: event
          // additional locals, a custom layout, or other options can be defined here
        });
      }
    } catch (error) {

    }
  },

  login: async (req, res, next) => {

    res.locals = {
      title: 'Login',
      message: '',
      layout: 'layout'
    };
    res.render('login', {
    })
  },

  logout: async (req, res, next) => {
    req.logOut();
    res.status(200).json(req.user);
  },

  thu: async (req, res, next) => {
    res.locals = {
      title: 'Thu',
      message: 'This is a message',
      Active: '.thu #products'
    };
    res.render('ThongKe/thu', {
    })
  },

  refund: async (req, res, next) => {
    res.locals = {
      title: 'Thu',
      message: 'This is a message',
      Active: '.refund #products'
    };
    res.render('ThongKe/refund', {
    })
  },

  chi: async (req, res, next) => {
    res.locals = {
      title: 'Chi',
      message: 'This is a message',
      Active: '.chi #products'
    };
    res.render('ThongKe/chi', {
    })
  },
  thanh_toan: async (req, res, next) => {
    res.locals = {
      title: 'Thanh toán tiền',
      message: 'This is a message',
      Ten: 'sang',
      mUserId: 'NULL',
      Active: '.thanh_toan #products'
    };

    res.render('ThongKe/thanh_toan', {
      // additional locals, a custom layout, or other options can be defined here
    });
  },
};
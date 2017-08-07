const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const models = require('./models');
const User = models.user;

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new facebookStrategy({
        clientID: config.facebook.clientID,
        clientSecret: config.facebook.clientSecret,
        callbackURL: config.facebook.callbackURL,
        profileFields: ['id', 'email', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified'],
        },
        function(accessToken, refreshToken, profile, cb) {
            User.findOrCreate({ facebookId: profile.id }, function (err, user) {
              return cb(err, user);
            });
        }
    ));
};

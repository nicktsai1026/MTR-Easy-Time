const passport = require('passport');
const facebookStrategy = require('passport-facebook').Strategy;
const models = require('./models');
const User = models.user;
const Redis = require('./redis');

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use('facebook', new facebookStrategy({
        clientID: '109100156427112',
        clientSecret: '6fcf61cd163db93babd249db426d73d9',
<<<<<<< HEAD
        callbackURL: 'https://f9c6adb7.ngrok.io/auth/facebook/callback',
=======
        // callbackURL: 'https://2a6921d9.ngrok.io/auth/facebook/callback',
        callbackURL: 'http://174.138.24.195.xip.io/auth/facebook/callback',
>>>>>>> 8c7ef0e093a7e9ee1e9226afc5fe97f3b6ea0456
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        function (accessToken, refreshToken, profile, cb) {
                var teleId;
                Redis.get('telegram', function (err, data) {
                    if (err) return console.log(err);
                    teleId = JSON.parse(data)
                User.update(
                    {
                        facebookId:profile.id
                    },
                    {
                        where: { telegramId: teleId.toString() }
                    }
                )
                .then((user)=>{
                    var fbInfoObj = {
                        access_token: accessToken,
                        fbId: profile.id,
                        fbName: profile.displayName,
                        fbPhoto: profile.photos[0].value,
                        telegramId:teleId
                    };
                    Redis.set(profile.id, JSON.stringify(fbInfoObj), function (err, data) {
                        if (err) {
                            return console.log(err);
                        }
                    });
                    return cb(null, fbInfoObj);
                })
                .catch((err)=>{
                    console.log(err);
                })
            })
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.fbId);
    });

    passport.deserializeUser((id, done) => {
        User.findOne({
            where: {
                facebookId: id
            }
        }).then(function (user) {
            if (user == null) {
                done(new Error('Wrong user id.'));
            }

            done(null, user);
        });
    });

};

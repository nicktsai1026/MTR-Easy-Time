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
        callbackURL: 'https://2a6921d9.ngrok.io/auth/facebook/callback',
        profileFields:['id','displayName','photos','email']
        },
        function(accessToken, refreshToken, profile, cb) {
            User.findOrCreate({where:{ facebookId: profile.id }})
                .then(function(user){
                    // console.log(accessToken);
                    // console.log(profile);
                    var fbInfoObj = {
                        access_token:accessToken,
                        fbId:profile.id,
                        fbName:profile.displayName,
                        fbPhoto:profile.photos[0].value
                    };
                    Redis.set(profile.id,JSON.stringify(fbInfoObj),function(err,data){
                        if(err){
                            return console.log(err);
                        }
                    });
                    return cb(null,user);
                })
                .catch((err)=>{
                    return cb(err);
                });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user[0].facebookId);
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

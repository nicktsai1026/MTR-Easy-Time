const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('./bcrypt');
const models = require('./models');
const Customer = models.customer;

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use('local-login', new LocalStrategy(
        (email, password, done) => {
            Customer.findOne({
                where: {
                    'email': email
                }
            }).then((customers) => {
                if (!customers) {
                    return done(null, false, { message: 'Incorrect credentials.' });
                }
                bcrypt.checkPassword(password, customers.password)
                .then(result => {
                    if(result) {
                        return done(null, customers);
                    } else {
                        return done(null, false, { message: 'Incorrect credentials'});
                    }
                })
                .catch(err => console.log(err));
            });
        }
    ));

    passport.serializeUser((customers, done) => {
        done(null, customers.id);
    });

    passport.deserializeUser((id, done) => {
        Customer.findOne({
            where: {
                'id': id
            }
        }).then(function (customers) {
            if (customers == null) {
                done(new Error('Wrong user id.'));
            }

            done(null, customers);
        });
    });
};

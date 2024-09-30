import passport from 'passport';
import Strategy from 'passport-discord';
import { DiscordUser } from '../mongoose/schemas/discord-user.mjs';

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const findUser = await DiscordUser.findById(id);
        return findUser ? done(null, findUser) : done(null, null);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy(
        {
            clientID: '1286362979784200192',
            clientSecret: 'i67kYXWnCtf5h93c46oCQeVK9UX0Ja_2',
            callbackURL: 'http://localhost:3000/api/auth/discord/redirect',
            scope: ['identify', 'guilds', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            let findUser;
            try {
                findUser = await DiscordUser.findOne({ discordId: profile.id });
            } catch (err) {
                return done(err, null);
            }
            try {
                if (!findUser) {
                    const newUser = new DiscordUser({
                        username: profile.username,
                        discordId: profile.id,
                    });

                    const newSavedUser = await newUser.save();
                    return done(null, newSavedUser);
                }
                return done(null, findUser);
            } catch (err) {
                console.log(err);
                return done(err, null);
            }
        }
    )
);

const express = require('express')
const app = express()

const dotenv = require('dotenv')
dotenv.config()




const cors = require('cors')

const FRONTEND_URL = process.env.NODE_ENV == 'production' ? process.env.FRONTEND_URL : 'http://localhost:3001'

app.use( cors({
    origin: FRONTEND_URL,
    credentials: true
}) )

const rateLimit = require("express-rate-limit");

// app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

//  apply to all requests
if(process.env.NODE_ENV === "production") app.use(limiter);


app.get('/', (req, res) => {
    res.send({
        "success": "fine",
        "yes": "no"
    })
})

app.use(express.json({
    limit: '50mb'
}));

app.use(express.urlencoded({
    limit: '50mb',
    parameterLimit: 100000,
    extended: true
  }));


// dirty dirty dirty

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
// const session = require('express-session')
// app.use(session({
// //   store: new (require('connect-pg-simple')(session))({
// //     createTableIfMissing: true
// //   }),
//   secret: process.env.SESSION_SECRET,
//   resave: true,
//   saveUninitialized: true,
//   cookie: { secure: !true }
// }));
app.use(passport.initialize());
// app.use(passport.session());

const {upsert_user, get_user_by_username} = require('./controller/user/user.controller')

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/redirect"
  },
  async (accessToken, refreshToken, profile, done) => {
    const user = await upsert_user(profile)
    done(null, user)
  }));

passport.serializeUser((user, done) => {
    done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
    done(null, get_user_by_username(username))
});


app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}));

const google_redirect_url = "/auth/google/redirect"

// app.get(google_redirect_url, passport.authenticate('google'), (req, res) => {
//     try{
//         console.log(req.session)
//         req.session.username = req.session.passport.user
//         let options = {
//             maxAge: 1000 * 60 * 15, // would expire after 15 minutes
//             httpOnly: true, // The cookie only accessible by the web server
//             signed: true // Indicates if the cookie should be signed
//         }
    
//         // Set cookie
//         res.cookie('cookieName', 'cookieValue', options)
//         console.log(res.cookie)
//         console.log('sex')
//     }catch(err){

//     }
//     // res.redirect(process.env.FRONTEND_URL)
//     res.send({sex: 'sex'})
// });

const {sign} = require('./Service/jwt')

const crypto = require("crypto")
const sexy_session = {}


app.get(google_redirect_url, passport.authenticate('google'), (req, res) => {
    // console.log(req.session.passport.user)
    const username = req.session.passport.user


    let poor_red = "";
    
    while(true){
        // poor_red = Math.random().toString(36).substr(10);
        poor_red = crypto.randomBytes(20).toString('hex')
        if(!sexy_session[poor_red]) break;
    }

    sexy_session[poor_red] = sign(username)

    // console.log('username', username)
    // // console.log(sign(username))
    
    let options = {
        maxAge: 1000 * 60 * 60 * 24 * 7, // would expire after 7 days
        // secure: true,
        sameSite: 'none',
        // domain: 'herokuapp.com',
        // httpOnly: false, // The cookie only accessible by the web server
        path: "/",
        secure: true,
        //domain: ".herokuapp.com", REMOVE THIS HELPED ME (I dont use a domain anymore)
        httpOnly: true
    }

    // console.log('cookie setting', sign(username))

    // // Set cookie
    res.cookie('glaxoj', sign(username), options)

    // console.log('res > ', res.cookies)

    //manually
    // res.setHeader('set-cookie', [`glaxoj=${sign(username)}; Domain=.herokuapp.com; sameSite: none;`])

    // res.send({s: 's'})
    res.redirect( ( process.env.NODE_ENV == 'production' ? process.env.FRONTEND_URL : 'http://localhost:3001') + `/auth?token=${poor_red}`)
    // res.redirect('/verify')
});

app.post('/auth', (req, res) => {
    // res.redirect(302, process.env.NODE_ENV == 'production' ? process.env.FRONTEND_URL : 'http://localhost:3001')
    const token = req.body.token;
    try{ //console.log(token)
        const cookie = sexy_session[token]
        if(!cookie) throw Error('no token')
        // console.log(cookie, sexy_session, token)
        let options = {
            maxAge: 1000 * 60 * 60 * 24 * 7, // would expire after 7 days
            // secure: true,
            sameSite: 'none',
            // domain: 'herokuapp.com',
            // httpOnly: false, // The cookie only accessible by the web server
            path: "/",
            secure: true,
            //domain: ".herokuapp.com", REMOVE THIS HELPED ME (I dont use a domain anymore)
            httpOnly: true
        }
        res.cookie('glaxoj', cookie, options)
        delete sexy_session[token]
        res.send( SUCCESS(cookie) )

    } catch(err) {
        console.log(err)
        res.send( FAILURE() )
    }
    
})



const routes = require('./routes')

app.use(routes)

const db = require('./models')

const {start_judge_queue} = require('./controller/judge')
const { SUCCESS, FAILURE } = require('./api_response')
start_judge_queue(); // start judge queue at the beginning


const {ektu_chalak_function} = require('./controller/submission/submission.controller')

db.sequelize.sync({ alter: true }).then(async(_) => { 
    console.log('database connected')
    
    // one temporary thing 
    ektu_chalak_function()
    
    
    // adding one default admin if not there
    await upsert_user({
        displayName: process.env.ADMIN_NAME,
        emails: [ { value: process.env.ADMIN_EMAIL } ],
        photos: [
            {
            value: process.env.ADMIN_PICTURE
            }
        ],
        role: ['ADMIN']
    })
    
    app.listen( process.env.PORT || 3000 , () => { // fuck you heroku
        console.log(`server running`)
    })
})


// app.listen(process.env.PORT, () => {
//     console.log('yes')
// })

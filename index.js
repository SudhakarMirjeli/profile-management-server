require('dotenv').config();
const PORT = process.env.PORT || 4000;

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
// const axios = require("axios");



const session = require('express-session');
const OpenIdClient = require('openid-client');

const { Issuer, generators } = OpenIdClient;


const UserRoutes = require('./routes/user.routes');
const TokenExchange= require('./utils/auth.service')

const app = express();


let client;
// Initialize OpenID Client
async function initializeClient() {
    const issuer = await Issuer.discover('https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_acr41eO1x');
    client = new issuer.Client({
        client_id: process.env.AWS_COGNITO_CLIENT_ID,
        client_secret: process.env.AWS_COGNITO_SECRET_KEY,
        redirect_uris: ['http://localhost:3000/'],
        response_types: ['code']
    });
};
initializeClient().catch(console.error);

app.use(session({
    secret: 'some secret',
    resave: false,
    saveUninitialized: false
}));

app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cors());

// Server health check
app.get('/health-check', (req, res) => {
    res.send("Server is running successfully......")
})

// User Profile routes
app.use('/profile', UserRoutes)


// Login route
app.get('/login', (req, res) => {
    const nonce = generators.nonce();
    const state = generators.state();
    req.session.nonce = nonce;
    req.session.state = state;
    const authUrl = client.authorizationUrl({
        scope: 'phone openid email',
        state: state,
        nonce: nonce,
    });

    res.redirect(authUrl);
});


// Helper function to get the path from the URL.
function getPathFromURL(urlString) {
    try {
        const url = new URL(urlString);
        return url.pathname;
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

app.get(getPathFromURL('http://localhost:3000/auth/callback'), async (req, res) => {
    try {
        const params = client.callbackParams(req);
        const tokenSet = await client.callback(
            'http://localhost:3000/auth/callback',
            params,
            {
                nonce: req.session.nonce,
                state: req.session.state
            }
        );
        const userInfo = await client.userinfo(tokenSet.access_token);
        req.session.userInfo = userInfo;

        res.redirect('/');
    } catch (err) {
        console.error('Callback error:', err);
        res.redirect('/');
    }
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy();
    const logoutUrl = `https://${process.env.AWS_COGNITO_DOMAIN}/logout?client_id=${process.env.AWS_COGNITO_CLIENT_ID}&logout_uri=<logout uri>`;
    res.redirect(logoutUrl);
});

// Token exchange
app.post("/auth/cognito/token", (req,res)=>TokenExchange.exchangeToken(req,res));


app.listen(PORT, () => {
    console.log(`server is running on port, ${PORT}`)
})

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGO_URL, options)
    .then(() => console.log("MongoDB Connection Successfully..."))
    .catch(err => console.error("MongoDB Connection Failed:", err));

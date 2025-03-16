const jwt = require("jsonwebtoken");
const jwksClient = require("jwks-rsa");
const axios = require("axios");

const COGNITO_REGION = "us-east-1"; // Replace with your Cognito region
const USER_POOL_ID = "us-east-1_ABC123"; // Replace with your Cognito User Pool ID
const JWKS_URL = `https://cognito-idp.${COGNITO_REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;

// Initialize JWKS client
const client = jwksClient({
    jwksUri: JWKS_URL
});

// Function to get the signing key
const getKey = (header, callback) => {
    client.getSigningKey(header.kid, (err, key) => {
        if (err) {
            return callback(err);
        }
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null, signingKey);
    });
};

// Middleware to check auth
const checkAuth = (req, res, next) => {

    const token = req.headers.authorization;
    console.log("inside middlewares", token)

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const tokenParts = token.split(" ");
    if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
        return res.status(401).json({ message: "Unauthorized: Invalid token format" });
    }

    const jwtToken = tokenParts[1];

    jwt.verify(jwtToken, getKey, { algorithms: ["RS256"] }, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }

        req.user = decoded; // Attach user info to the request
        req.isAuthenticated = true;
        next();
    });
};

async function exchangeToken (req, res){
    try {
        const { code } = req.body;
        console.log("inside 118888", code,)

        const tokenUrl = `https://${process.env.AWS_COGNITO_DOMAIN}/oauth2/token`
        // `https://${process.env.AWS_COGNITO_DOMAIN}/oauth2/token`;
        console.log("tokenUrl", tokenUrl)

        const response = await axios.post(tokenUrl, new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.AWS_COGNITO_CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET, // Only if required
            redirect_uri: process.env.REDIRECT_URI,
            code
        }), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });
        console.log("in backend token verify", response)
        res.json({
            accessToken: response.data.access_token,
            idToken: response.data.id_token,
            refreshToken: response.data.refresh_token
        });

    } catch (error) {
        console.error("Error exchanging code for token:", error.response?.data || error.message);
        res.status(500).json({ message: "Failed to authenticate" });
    }
}

module.exports ={checkAuth,exchangeToken} ;

const express = require('express')
const request = require('request')
const cors = require('cors')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')

const clientID = 'b73bb6d645664a5c8648994b4b95a763'
// let clientSecret = require('./client-secret.js')
const redirectURI = 'http://localhost:3000/callback'

const stateKey = 'spotify_auth_state';
const app = express();


const generateRandomString = length => {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};  

console.log('clientID:', clientID)

app.use(express.static(__dirname + '../public'))
    .use(cors())
    .use(cookieParser());

app.get('/login', (req, res) => {
    console.log('login')
    const state = generateRandomString(16);
    res.cookie(stateKey, state);

    const scope = 'playlist-read-private';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: clientID,
            scope: scope,
            redirect_uri: redirectURI,
            state: state
        }));
});

app.get('/callback', (req, res) => {
    // console.log('callback')
    const code = req.query.code || null;
    const state = req.query.state || null;
    const storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        res.clearCookie(stateKey);
        const authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirectURI,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + Buffer.from(clientID + ':' + require('../client-secret.js')).toString('base64')
            },
            json: true
        };

        request.post(authOptions, (error, response, body) => {
            if (!error && response.statusCode === 200) {

                const access_token = body.access_token,
                    refresh_token = body.refresh_token;

                res.redirect('/#' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    }));
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    }));
            }
        });
    }
});

app.listen(3000, () => console.log("Server ready on port 3000."));
module.exports = app;
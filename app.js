const express = require('express')
const request = require('request')
const cors = require('cors')
const querystring = require('querystring')
const cookieParser = require('cookie-parser')

const clientID = 'b73bb6d645664a5c8648994b4b95a763'
const clientSecret = require('./client-secret.js')
const redirectURI = 'http://localhost:8888/callback'

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

app.use(express.static(__dirname + '/public'))
    .use(cors())
    .use(cookieParser());

app.get('/login', (req, res) => {
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
                    'Authorization': 'Basic ' + Buffer.from(clientID + ':' + clientSecret).toString('base64')
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

app.listen(8888);
console.log('Listening on 8888');

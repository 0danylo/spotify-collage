const test = require('node:test');
const assert = require('node:assert/strict');

const originalEnv = {
    SPOTIFY_REDIRECT_URI: process.env.SPOTIFY_REDIRECT_URI,
    REDIRECT_URI: process.env.REDIRECT_URI,
    APP_BASE_URL: process.env.APP_BASE_URL
};

const { resolveRedirectURI } = require('./index');

const makeReq = ({ protocol = 'http', host = 'localhost:3000', headers = {} } = {}) => ({
    protocol,
    headers,
    get: key => (key === 'host' ? host : undefined)
});

const resetEnv = () => {
    const entries = Object.entries(originalEnv);
    for (const [key, value] of entries) {
        if (value === undefined) {
            delete process.env[key];
        } else {
            process.env[key] = value;
        }
    }
};

test.afterEach(() => {
    resetEnv();
});

test('uses configured https redirect URI', () => {
    process.env.REDIRECT_URI = 'https://app.example.com/callback';
    assert.equal(resolveRedirectURI(makeReq()), 'https://app.example.com/callback');
});

test('allows localhost http redirect URI for local development', () => {
    delete process.env.SPOTIFY_REDIRECT_URI;
    process.env.REDIRECT_URI = 'http://localhost:3000/callback';
    assert.equal(resolveRedirectURI(makeReq()), 'http://localhost:3000/callback');
});

test('rejects insecure configured redirect URI outside localhost', () => {
    delete process.env.SPOTIFY_REDIRECT_URI;
    process.env.REDIRECT_URI = 'http://app.example.com/callback';
    assert.throws(() => resolveRedirectURI(makeReq()), /Insecure redirect_uri/);
});

test('builds redirect URI from APP_BASE_URL', () => {
    delete process.env.SPOTIFY_REDIRECT_URI;
    delete process.env.REDIRECT_URI;
    process.env.APP_BASE_URL = 'https://app.example.com';
    assert.equal(resolveRedirectURI(makeReq()), 'https://app.example.com/callback');
});

test('uses forwarded host/proto and enforces https for non-local requests', () => {
    delete process.env.SPOTIFY_REDIRECT_URI;
    delete process.env.REDIRECT_URI;
    delete process.env.APP_BASE_URL;

    const req = makeReq({
        protocol: 'http',
        host: 'internal.service',
        headers: {
            'x-forwarded-proto': 'https',
            'x-forwarded-host': 'app.example.com'
        }
    });

    assert.equal(resolveRedirectURI(req), 'https://app.example.com/callback');
});

test('rejects inferred http redirect URI for non-local host', () => {
    delete process.env.SPOTIFY_REDIRECT_URI;
    delete process.env.REDIRECT_URI;
    delete process.env.APP_BASE_URL;

    const req = makeReq({
        protocol: 'http',
        host: 'app.example.com'
    });

    assert.throws(() => resolveRedirectURI(req), /Insecure redirect_uri/);
});

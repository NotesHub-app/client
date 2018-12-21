import request from 'superagent';
import { randomString } from './utils/string';

const rootUrl = 'http://localhost:4000';
const config = {
    socketUrl: rootUrl,
    apiUrl: `${rootUrl}/api`,
    siteUrl: `http://localhost:3000`,
    wsClientId: randomString(20),
};

export default config;

export async function getServerConfiguration() {
    const { body: serverConfiguration } = await request
        .get(`${config.apiUrl}/serverConfiguration`)
        .set('accept', 'json');

    config.serverConfiguration = serverConfiguration;
}

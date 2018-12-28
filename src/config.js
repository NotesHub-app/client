import request from 'superagent';
import { randomString } from './utils/string';

const apiServerUrl = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:4000';

const config = {
    socketUrl: apiServerUrl,
    apiUrl: `${apiServerUrl}/api`,
    wsClientId: randomString(20),
};

export default config;

export async function getServerConfiguration() {
    const { body: serverConfiguration } = await request
        .get(`${config.apiUrl}/serverConfiguration`)
        .set('accept', 'json');

    config.serverConfiguration = serverConfiguration;
}

import puppeteer from 'puppeteer';
import { extendPageFunctions, tcs, uploadBlankConfig } from './helpers';

let browser;
let page;
const mainUrl = 'http://localhost:3000/?testing=1';

beforeAll(async () => {
    browser = await puppeteer.launch({
        headless: false,
        defaultViewport: {
            width: 1200,
            height: 1200,
        },
        slowMo: 0, // чем выше - тем медленнее
        // devtools: true,
    });
    page = await browser.newPage();

    page.emulate({
        viewport: {
            width: 1200,
            height: 1200,
        },
        userAgent: '',
    });

    await page.goto(mainUrl);

    extendPageFunctions(page);

    // Дожидаемся появления лого
    await page.waitForSelector(tcs('logo'));
}, 16 * 1000);

afterAll(async () => {
    browser.close();
});


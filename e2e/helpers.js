import { tc } from '../src/utils/helpers';

export function tcs(value) {
    const result = tc(value);
    return result && `.${result}`;
}

/**
 * Добавить вспомогательные функции в объект страницы puppeteer
 * @param page
 */
export function extendPageFunctions(page) {
    /**
     * Выбрать элемент меню по названию
     * @param menuSelector
     * @param text
     * @returns {Promise<void>}
     */
    page.selectMenuElementByText = async (menuSelector, text) => {
        await page.click(menuSelector);
        await page.waitForSelector(`${menuSelector} .pt-menu-item`);
        await page.evaluate(
            (menuSelector, text) => {
                Array.from(document.querySelectorAll(`${menuSelector} .pt-menu-item`))
                    .filter(element => element.textContent === text)[0]
                    .click();
            },
            menuSelector,
            text,
        );
    };

    /**
     * Выбрать первый вариант в меню
     * @param menuSelector
     * @returns {Promise<void>}
     */
    page.selectMenuFirstElement = async menuSelector => {
        await page.click(menuSelector);
        await page.waitForSelector(`${menuSelector} .pt-menu-item`);
        await page.click(`${menuSelector} .pt-menu-item`);
    };

    /**
     * Дождаться появляение текста в заданном селекторе
     * @param parentSelector
     * @param text
     */
    page.waitForText = async (parentSelector, text) => {
        await page.waitForFunction(
            (menuSelector, text) => {
                const el = document.querySelector(menuSelector);
                return el && el.innerText.includes(text);
            },
            {},
            parentSelector,
            text,
        );
    };

    /**
     * Подождать и нажать
     * @param selector
     * @param clickOptions
     */
    page.waitAndClick = async (selector, clickOptions) => {
        await page.waitForSelector(selector);
        await page.click(selector, clickOptions);
    };

    /**
     * Подождать до исчезновения селектора
     * @param selector
     * @returns {Promise<void>}
     */
    page.waitForDisappear = async selector => {
        await page.waitForSelector(selector, { hidden: true });
    };
}

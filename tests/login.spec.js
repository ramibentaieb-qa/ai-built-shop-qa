const {test, expect, chromium} = require ('@playwright/test');

const HomePage = require('../pages-objects/HomePage');
const LoginPage = require('../pages-objects/LoginPage');
const RegisterPage = require('../pages-objects/RegisterPage');


test.describe('Testing Login Page', () => {
    /**@type {HomePage} */
    let homePage;
    /**@type {LoginPage} */
    let loginPage;
    /**@type {RegisterPage} */
    let registerPage;

    test.beforeEach(async({page}) => {
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);

        await homePage.openHomePage();
        await homePage.clickRegisterLink();

        await registerPage.fillAndSubmit('jon doe', 'jondoe@email.com', 'jondoe123');
        await homePage.clickLogoutLink();
    })

    test('Successful login with valid credentials', async ({page}) => {
        
        await expect(page.getByTestId('nav-user-name')).toBeHidden();
        await expect(page.getByTestId('nav-logout')).toBeHidden();

        await homePage.clickLoginLink();
        await loginPage.loginFillAndSubmit('jondoe@email.com', 'jondoe123');

        await expect(page).toHaveURL(/\//);
        await expect(page.getByTestId('nav-user-name')).toHaveText('jon doe')
        await expect(page.getByTestId('nav-logout')).toBeVisible();


        /** Testing Logout button */
        await homePage.clickLogoutLink();
        await expect(page.getByTestId('nav-login')).toBeVisible();
        await expect(page.getByTestId('nav-register')).toBeVisible();
    })


    test('Login Page Loads with required fields', async ({page}) => {

        await homePage.clickLoginLink();

        await expect(page).toHaveURL(/\/login/);
        await expect(loginPage.heading).toHaveText('Log in');

        await loginPage.clickLoginButton();
        await expect(page.locator('#login-email-error, #login-password-error')).toHaveText([
            'Email is required',
            'Password is required'
        ])
    })


    test('Failed login with invalid credentials', async ({page}) => {

        await homePage.clickLoginLink();

        await loginPage.loginFillAndSubmit('wrongmail@email.com', 'jondoe123')
        await expect(page.locator('#login-error')).toHaveText('Invalid email or password');

        await loginPage.loginFillAndSubmit('jondoe@email.com', 'wrongPassword')
        await expect(page.locator('#login-error')).toHaveText('Invalid email or password');
    })


    test('Session survives after a page refresh but not after a closed browser', async ({page, context}) => {

        await homePage.clickLoginLink()

        await loginPage.loginFillAndSubmit('jondoe@email.com', 'jondoe123');

        await page.reload();
        await expect(page.getByTestId('nav-user-name')).toBeVisible();
        

        const newTab = await context.newPage();
        await newTab.goto('http://localhost:3000/');

        await expect(newTab.getByTestId('nav-login')).toBeVisible();
        await expect(newTab.getByTestId('nav-user-name')).toBeHidden();
     })
})

test.describe('Session expiry afer 24 hours', () => {
    const HOUR = 60 * 60 * 1000;
    /** @type {HomePage} */
    let homePage;
    /** @type {RegisterPage} */
    let registerPage;
    /**@type {LoginPage} */
    let loginPage;

    test.beforeEach(async({page}) => {
        await page.clock.install({ time: new Date('2026-11-16T10:00:00')});
        
        homePage = new HomePage(page);
        loginPage = new LoginPage(page);
        registerPage = new RegisterPage(page);

        await homePage.openHomePage();
        await homePage.clickRegisterLink();

        await registerPage.fillAndSubmit('jon doe', 'jondoe@email.com', 'jondoe123');

        await homePage.clickLogoutLink();

        await homePage.clickLoginLink();
        await loginPage.loginFillAndSubmit('jondoe@email.com', 'jondoe123');
        await expect(page.getByTestId('nav-user-name')).toContainText('jon doe')
    })

        test('Session is kept before 24 hours', async({page}) => {
            await page.clock.fastForward(23 * HOUR + 59 * 60 * 1000);
            await page.reload();
            await expect(page.getByTestId('nav-user-name')).toBeVisible();
        })

        test('Session is expired after 24 hours', async ({page}) => {
            await page.clock.fastForward(24 * HOUR + 60 * 1000);
            await page.reload();

            await expect(page.getByTestId('nav-login')).toBeVisible();
            // await expect(page.getByTestId('session-expired-message')).toContainText('Your demo account has expired, please register again')
        })


})
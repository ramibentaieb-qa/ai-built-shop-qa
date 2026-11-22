const {test, expect} = require ('@playwright/test');
const HomePage = require ('../pages-objects/HomePage');
const RegisterPage = require ('../pages-objects/RegisterPage')

test.describe('Testing Register Page', () => {

    /** @type {HomePage} */
    let homePage;
    /** @type {RegisterPage} */
    let registerPage;

    test.beforeEach(async({page}) => {
        homePage = new HomePage(page);
        registerPage = new  RegisterPage(page)

        await homePage.openHomePage();
        await homePage.clickRegisterLink();
        
    })

    test('Register Page Loads', async({page}) => {

        await expect(page).toHaveURL(/\/register/);
        await expect(registerPage.heading).toHaveText('Create an account');
    })


    test('Registation fields are required', async({page}) => {
        await registerPage.clickCreateAccountButton();
        await expect(page.locator('#register-name-error, #register-email-error, #register-password-error, #register-confirm-password-error'))
        .toHaveText([
            'Full name is required',
            'Email is required',
            'Password is required',
            'Confirm password is required'
        ])
    })


    test('Registration fails with invalid emails and password', async({page}) => {

        await registerPage.fillAndSubmit('Jon NonValid', 'wrong-email-format', 'under8', 'diffPass');

        await expect(page.locator('#register-email-error, #register-password-error, #register-confirm-password-error'))
        .toHaveText([
            'Please enter a valid email address',
            'Password must be at least 8 characters',
            'Passwords do not match'
        ])
    })


    test('Successful Register with valid credentials', async({page}) => {
        await registerPage.fillAndSubmit('Jon Doe', 'jondoe@email.com', 'jondoe123');
        await expect(page.getByTestId('welcome-message')).toBeVisible()
    })


    /** see Story 9 */
    test('Successful registration logs the shopper in and redirects to home page', { tag: '@smoke'}, async({page}) => {
        await expect(page.getByTestId('nav-register')).toBeVisible();
        
        await registerPage.fillAndSubmit('Jon Doe', 'jondoe@email.com', 'jondoe123');
        
        await expect(page).toHaveURL('/');
        await expect(page.getByTestId('nav-user-name')).toHaveText('Jon Doe');
        await expect(page.getByTestId('nav-logout')).toBeVisible();
        await expect(page.getByTestId('nav-register')).toBeHidden();
        await expect(page.getByTestId('nav-login')).toBeHidden();
        await expect(page.getByTestId('welcome-message')).toContainText('Jon Doe');
    })


    test('Attempt to Register with an already saved email', async ({page}) => {

        /**save a new user */
        await registerPage.fillAndSubmit('Jon Doe', 'jondoe@email.com', 'jondoe123');
        
        await expect(page.getByTestId('welcome-message')).toBeVisible()

        await homePage.clickLogoutLink()
        await homePage.clickRegisterLink()

        /** First attempt */
        await registerPage.fillAndSubmit('Diff Person', "jondoe@email.com", "diff-pass")
        
        await expect(page.locator('#register-email-error')).toHaveText('This email is already registered')

        /**Second attempt  with a Capital letter */
        await registerPage.setEmail("Jondoe@email.com")
        await registerPage.clickCreateAccountButton();
        await expect(page.locator('#register-email-error')).toHaveText('This email is already registered')
    })

})

test.describe('Account expiry afer 24 hours', () => {
    const HOUR = 60 * 60 * 1000;
    /** @type {HomePage} */
    let homePage;
    /** @type {RegisterPage} */
    let registerPage;

    test.beforeEach(async ({page}) => {
        await page.clock.install({ time: new Date('2026-11-16T10:00:00')});

        homePage = new HomePage(page);
        registerPage = new RegisterPage(page);
        await homePage.openHomePage();
        await homePage.clickRegisterLink();

        await registerPage.fillAndSubmit('Jon Doe', 'jondoe@email.com', 'jondoe1234');
        await expect(page.getByTestId('nav-user-name')).toBeVisible();
    })

    test('Account is kept before 24 hours', async ({page}) => {
        /** I'm fast forwarding the time to 23h 59m */
        await page.clock.fastForward(23 * HOUR + 59 * 60 * 1000);
        await page.reload();

        await homePage.clickLogoutLink()
        await homePage.clickRegisterLink()

        await registerPage.fillAndSubmit('Other Person', 'jondoe@email.com', 'other1234');
        await expect(page.getByTestId('register-error-email')).toHaveText('This email is already registered');
    });

    test('Account is deleted after 24 hours and the email can be reused', async ({page}) => {
        /** I'm fast forwarding the time to 24h 01m */
        await page.clock.fastForward(24 * HOUR + 60 * 1000);
        await page.reload();

        await expect(page.getByTestId('nav-login')).toBeVisible();

        await homePage.clickRegisterLink();
        await registerPage.fillAndSubmit('Other Person', 'jondoe@email.com', 'other1234');

        await expect(page.getByTestId('nav-user-name')).toContainText('Other Person')
    })
})

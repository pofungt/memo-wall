import { Page, chromium, Browser } from "playwright";
import "../app";

xdescribe("End-to-End", () => {
    let page: Page;
    let browser: Browser;

    beforeAll(async ()=>{
        browser = await chromium.launch({headless: false});
        page = await browser.newPage();
    });

    it('should display Memo Wall on title', async () => {
        await page.goto("http://localhost:8080");
        const title = await page.title();
        expect(title).toContain("Memo Wall");
    });

    afterAll(async ()=>{
        await browser.close();
        process.exit(0)
    })
})
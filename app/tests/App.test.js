import * as puppeteer from 'puppeteer';


describe(
    'Pass', () => {
        test('will pass', async () => {
            let browser = await puppeteer.launch({
                headless: true
            });
            expect(true).toBe(true);
        })
    }
);

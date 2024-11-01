import "dotenv/config";
import puppeteer from "puppeteer-extra";
import { promisify } from "util";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
const wait = promisify(setTimeout);
puppeteer.use(StealthPlugin());
puppeteer
  .launch({
    headless: false,
    args: ["--no-sandbox"],
  })
  .then(async (browser) => {
    const page = await browser.pages().then((p) => p[0]);
    page.goto("https://highseas.hackclub.com/");
    // after login ...
    console.log(`Login to slack now..`);
    // await wait(500);
    await page.waitForNavigation();
    try {
      await page.evaluate(() => {
        try {
          document
            .getElementsByClassName(
              "bg-white text-black p-2 px-3 sm:px-6 w-fit rounded-lg text-base linkPop",
            )[0]
            //@ts-ignore
            ?.click();
        } catch (e) {}
      });
    } catch (e) {}
    await page.waitForNavigation();
    await wait(200);
    await page.type('[data-qa="signin_domain_input"]', "hackclub");
    await page.click('[aria-label="Continue"]');
    await page.waitForNavigation();
    await wait(200);
    await page.type('[data-qa="email_field"]', process.env.EMAIL!);
    await page.click('[aria-label="Sign In With Email"]');
    await page.waitForNavigation();
    await wait(200);
    console.log(`Enter the code from your email now.`);
    const code: string = await new Promise((r) =>
      process.stdin.once("data", (d) => r(d.toString().trim())),
    );
    for (let i = 0; i < code.length; i++) {
      try {
        await page.type(`[aria-label*="digit ${i + 1} of 6"]`, code[i]);
      } catch (e) {}
      await wait(10);
    }
    // 2s for redirect & 3s for allow being allowed
    await wait(5000);
    await page.click('[aria-label="Allow"]');
    await wait(4500);
});
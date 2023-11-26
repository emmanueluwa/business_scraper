const puppeteer = require("puppeteer");

//hit gooogle business page
//enter search
//get businesses
// --- Business: name, address, category, number, review_count, review_avg
//save the output to a file

// function expression(= e.g math, going into a var)
//executed in parsing of language, line by line,
const setupBrowser = async () => {
  const viewportHeight = 1024;
  const viewportWidth = 1080;
  const browser = await puppeteer.launch();

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: viewportWidth, height: viewportHeight });

  return [browser, page];
};

// function declaration
// hoisted -> can be used before it is declared, helpful since js is a language for the web
// ---- ---- -functions usually created to be added to html and onClick() events
async function run() {
  const searchQuery = "holistic vets da5 2jq";

  const [browser, page] = await setupBrowser();

  await page.goto("https://www.google.com/", { waitUntil: "domcontentlaoded" });
  await page.waitForSelector('input[aria-label="Search"]', { visible: true });
  await page.type('input[aria-label="Search"]', searchQuery);
  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.keyboard.press("Enter"),
  ]);

  //click business button

  await page.waitForSelector(".rgnuSb.xYjf2e");

  const businessTextCollection = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".rgnuSb.xYjf2e")).map(
      (title) => title.innerText
    );
  });

  console.log(businessTextCollection);

  //click link to go on each bussiness, get rating and reviews
}

run();

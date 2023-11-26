//hit gooogle business page
//enter search
//get businesses
// --- Business: name, address, category, number, review_count, review_avg
//save the output to a file

const puppeteer = require("puppeteer");

// to avoid rate limiting, act liek a real person and add pauses
const timeout = (miliseconds) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, miliseconds);
  });
};

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

  const businessLinks = await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".data-profile-url-path")).map(
      (title) => title.innerText
    );
  });

  console.log(businessLinks);

  const businessData = [];

  for (let businessLink of businessLinks) {
    await Promise.all([page.click(businessLink)]);

    await page.waitForSelector(".rgnuSb.tZPcob");

    const businessDataItem = await page.evaluate(() => {
      const name = document.querySelector(".rgnuSb.tZPcob").innerText;

      const categories = document.querySelector(".AQrsxc").innerText;

      const number = document.querySelector(".eigqqc").innerText;

      return {
        name,
        categories,
        number,
      };
    });

    businessData.push(businessDataItem);
  }

  console.log("businessData: ", businessData);
  //click link to go on each bussiness, get rating and reviews

  // businessDataItem {
  //   businessName: "",
  //   categories: [],
  //   number: ""
  // }
}

run();

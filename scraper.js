//hit gooogle business page
//enter search
//get businesses
// --- Business: name, address, category, number, review_count, review_avg
//save the output to a file

const fs = require("fs");
const puppeteer = require("puppeteer");

// to avoid rate limiting, act like a real person and add pauses
// simulating a sleep function
const sleep = (miliseconds) => {
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
  const browser = await puppeteer.launch({});

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: viewportWidth, height: viewportHeight });

  return [browser, page];
};

const getBusinessData = async (searchQuery) => {
  //click business button
  const isElementVisible = async (page, classSelecetor) => {
    let visible = true;
    await page
      .waitForSelector(classSelecetor, { visible: true, timeout: 2000 })
      .catch(() => {
        visible = false;
      });
    return visible;
  };

  const [browser, page] = await setupBrowser();

  await page.goto("https://www.google.com/", { waitUntil: "domcontentloaded" });

  // consent form handling click "Accept all"
  await page.waitForSelector("#L2AGLb");
  await page.click("#L2AGLb", { delay: 1000 });

  await page.type('textarea[name="q"]', searchQuery);

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.keyboard.press("Enter"),
  ]);

  await page.waitForSelector(".CHn7Qb.pYouzb");
  const moreBusinessesGoogleLink = await page.evaluate(() => {
    return document.querySelector(".CHn7Qb.pYouzb").href;
  });

  //load more businesses
  await page.goto(moreBusinessesGoogleLink);

  //clicking each business name to get each business detail section

  //wait for all the business listings to load
  await page.waitForSelector("div[data-profile-url-path]");

  const businessLinks = await page.$$eval(
    "div[data-profile-url-path]",
    (elements) => {
      return elements.map((element) =>
        element.getAttribute("data-profile-url-path")
      );
    }
  );

  const businessData = [];

  for (let businessLink of businessLinks) {
    console.log("Going to:", businessLink);
    const businessPage = `https://www.google.com${businessLink}`;

    await page.goto(businessPage, { waitUntil: "domcontentloaded" });

    const businessDataItem = await page.evaluate(() => {
      // page.waitForSelector(".rgnuSb.tZPcob");
      const name = document.querySelector(".rgnuSb.tZPcob").innerText;

      // page.waitForSelector(".AQrsxc");
      const categories = document.querySelector(".AQrsxc").innerText;

      // page.waitForSelector(".eigqqc");
      const number = document.querySelector(".eigqqc").innerText;

      const avgRatingElement = document.querySelector(".ZjTWef.QoUabe");
      const avgRating = avgRatingElement ? avgRatingElement.innerText : "N/A";

      const numOfRatingsElement = document.querySelector(".PN9vWe");
      const numOfRatings = numOfRatingsElement
        ? numOfRatingsElement.innerText.slice(1, -1)
        : "N/A";

      return {
        name,
        avgRating,
        numOfRatings,
        categories,
        number,
      };
    });

    businessData.push(businessDataItem);
    await sleep(1000); // TODO: ADD randomisation on timeouts
  }

  console.log("businessData count: ", businessData.length);
  //click link to go on each bussiness, get rating and reviews

  fs.writeFileSync(
    "scraped-business-data.json",
    JSON.stringify(businessData),
    "utf-8"
  );
  return true;
};

// function declaration
// hoisted -> can be used before it is declared, helpful since js is a language for the web
// ---- ---- -functions usually created to be added to html and onClick() events
async function run() {
  const searchQuery = "holistic vet da5 2jq";

  getBusinessData(searchQuery);

  return true;
}

run();

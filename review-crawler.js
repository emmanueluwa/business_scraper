// Generic

// I will enter 3 different platforms and do review searches for "Holistic Vet"
// // yelp
// // google
// // trustpilot
// I will keep scraping until I get a lot of data

//sets up headless browser to run routines in browser to automate
const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");
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
  const browser = await puppeteer.launch({ headless: "new" });

  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);
  await page.setViewport({ width: viewportWidth, height: viewportHeight });

  return [browser, page];
};

async function getReviewUrlList(page) {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".css-19v1rkv")).map((el) => {
      return el.href;
    });
  });
}

async function run() {
  const [browser, page] = await setupBrowser();

  //setting user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  let skipCursor = 0;
  let hasNewReviews = [];

  let reviewsToScrape = [];

  while (hasNewReviews) {
    await page.goto(
      `https://www.yelp.co.uk/search?find_desc=vet&find_loc=London&start=${skipCursor}`
    );

    // get the url needed
    let newUrls = [];
    try {
      newUrls = await getReviewUrlList(page);
    } catch (e) {
      console.log(e);
    }

    skipCursor += 10;
    if (newUrls.length === 0) {
      //ending loop here, assuming when "skipCursor" reaches end newUrls is empty
      hasNewReviews = false;
    } else {
      reviewsToScrape = reviewsToScrape.concat(newUrls);
    }

    console.log("reviewsToScrape:", reviewsToScrape);

    await sleep(1000);
  }

  for (let reviewUrl of reviewsToScrape) {
    //scrape the review info
  }
}

run();

// "https://www.yelp.co.uk/biz/canonbury-veterinary-practice-london?osq=vet&start=10"

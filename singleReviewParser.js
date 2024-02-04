const { Readability } = require("@mozilla/readability");
const { JSDOM } = require("jsdom");
//sets up headless browser to run routines in browser to automate
const puppeteer = require("puppeteer");
const fs = require("fs");

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

//TODO: review data should be filtered and cleaned
async function getReviewText(page) {
  //wait for reviews to be present
  await page.waitForSelector(".raw__09f24__T4Ezm");

  const reviews = await page.$$eval(".raw__09f24__T4Ezm", (reviewElements) => {
    return reviewElements.map((el) => {
      //get text for each review
      const reviewText = el.textContent.trim();
      return { reviewText };
    });
  });

  console.log("Reviews:", reviews);
  return reviews;
}

async function run() {
  const [browser, page] = await setupBrowser();

  //setting user agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
  );

  //get url passed to script
  await page.goto(
    "https://www.yelp.co.uk/biz/canonbury-veterinary-practice-london?osq=vet"
  );

  const reviewTextArray = await getReviewText(page);

  //combining array of review texts into single string
  const reviewText = reviewTextArray
    .map((review) => review.reviewText)
    .join("\n");

  fs.writeFileSync("./best_review_temp.txt", reviewText, "utf-8");

  process.exit(0);
}

run();

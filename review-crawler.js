// Generic

// I will enter 3 different platforms and do review searches for "Holistic Vet"
// // yelp
// // google
// // trustpilot
// I will keep scraping until I get a lot of data

//abstractly scrapes aricle text from webpage
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

async function getReviewUrlList(page) {
  return await page.evaluate(() => {
    return Array.from(document.querySelectorAll(".css-19v1rkv")).map((el) => {
      return el.href;
    });
  });
}

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

  let skipCursor = 0;
  let hasNewReviews = [];

  const pageLimit = 20;

  let reviewsToScrape = [];

  while (hasNewReviews) {
    //controlling page limit
    if (reviewsToScrape.length > pageLimit) {
      break;
    }

    console.log("Going to new page");
    await page.goto(
      `https://www.yelp.co.uk/search?find_desc=vet&find_loc=London&start=${skipCursor}`
    );

    // get the url needed
    let newUrls = [];
    try {
      newUrls = await getReviewUrlList(page);
    } catch (e) {
      console.log(e);
      break;
    }

    skipCursor += 10;
    if (newUrls.length === 0) {
      //ending loop here, assuming when "skipCursor" reaches end newUrls is empty
      //the natural end of the pagination
      hasNewReviews = false;
    } else {
      reviewsToScrape = reviewsToScrape.concat(newUrls);
    }

    console.log("reviewsToScrape:", reviewsToScrape);

    await sleep(1000);
  }

  const corpus = [];

  for (let reviewUrl of reviewsToScrape) {
    //scrape the review info
    await page.goto(reviewUrl);

    const reviewText = await getReviewText(page);

    corpus.push({
      reviewText: reviewText,
      url: reviewUrl,
    });

    await sleep(1000);
  }

  fs.writeFileSync("./review_corpus.json", JSON.stringify(corpus), "utf-8");
}

run();

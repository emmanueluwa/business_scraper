//hit gooogle business page
//enter search
//get businesses
// --- Business: name, address, category, number, review_count, review_avg
//save the output to a file

const puppeteer = require("puppeteer");

// to avoid rate limiting, act liek a real person and add pauses
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

// function declaration
// hoisted -> can be used before it is declared, helpful since js is a language for the web
// ---- ---- -functions usually created to be added to html and onClick() events
async function run() {
  const searchQuery = "holistic vet da5 2jq";

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
  console.log("got to google ngu");

  // consent form handling click "Accept all"
  await page.waitForSelector("#L2AGLb");
  await page.click("#L2AGLb", { delay: 1000 });
  // const rejectAllButton = page.evaluate(() => {
  //   return document.querySelector(".QS5gu.sy4vM");
  // });

  // let rejectAllVisible = await isElementVisible(page, rejectAllButton);
  // while (rejectAllVisible) {
  //   await page.click(rejectAllButton).catch(() => {});
  //   loadMoreVisible = await isElementVisible(page, rejectAllButton);
  // }

  await page.screenshot({ path: "ooter.png" });

  // await page.waitForSelector('textarea[name="q"]', { visible: true });
  await page.type('textarea[name="q"]', searchQuery);
  console.log("got to google type");

  await page.screenshot({ path: "ooter1.png" });

  await Promise.all([
    page.waitForNavigation({ waitUntil: "domcontentloaded" }),
    page.keyboard.press("Enter"),
  ]);
  // await page.waitForNavigation({ waitUntil: "domcontentloaded" });
  // await page.keyboard.press("Enter");
  console.log("got here 1");
  // await page.waitForSelector(".rgnuSb.tZPcob");
  console.log("got here 2");
  await page.screenshot({ path: "ooter2.png" });

  await page.waitForSelector(".CHn7Qb.pYouzb");
  const moreBusinessesGoogleLink = await page.evaluate(() => {
    return document.querySelector(".CHn7Qb.pYouzb").href;
  });

  // let loadMoreVisible = await isElementVisible(page, moreBusinessesGoogleLink);
  // while (loadMoreVisible) {
  //   await page.goto(moreBusinessesGoogleLink, { delay: 1000 });
  //   loadMoreVisible = await isElementVisible(page, moreBusinessesGoogleLink);
  // }

  console.log(moreBusinessesGoogleLink);
  await page.goto(moreBusinessesGoogleLink);

  await page.screenshot({ path: "ooter3.png" });

  //clicking each business name to get each business detail section
  // const businessDetailLink = page.evaluate(() => {
  //   return document.querySelector(".rgnuSb.xYjf2e");
  // });

  console.log("got here 3");

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
  // const businessLinks = await page.evaluate(() => {
  //   console.log("got here 4");

  //   return Array.from(document.querySelectorAll("div[data-profile-url-path]")).map(
  //     (title) => title
  //   );
  // });

  console.log("businessLinks: ", businessLinks);

  const businessData = [];

  for (let businessLink of businessLinks) {
    const businessPage = `https://www.google.com${businessLink}`;

    console.log("BUSINESS_PAGE: ", businessPage);

    await page.goto(businessPage, { waitUntil: "domcontentloaded" });

    await page.screenshot({ path: "ooter4.png" });

    const businessDataItem = await page.evaluate(() => {
      page.waitForSelector(".rgnuSb.tZPcob");
      const name = document.querySelector(".rgnuSb.tZPcob").innerText;

      page.waitForSelector(".AQrsxc");
      const categories = document.querySelector(".AQrsxc").innerText;

      page.waitForSelector(".eigqqc");
      const number = document.querySelector(".eigqqc").innerText;

      return {
        name,
        categories,
        number,
      };
    });

    businessData.push(businessDataItem);
    await sleep(1000);
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

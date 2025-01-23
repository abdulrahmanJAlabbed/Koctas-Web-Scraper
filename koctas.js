const puppeteer = require('puppeteer');
const fs = require('fs');

// Define a function to get the main category links from the home page
async function getMainCategory(page) {
  await page.goto('https://www.koctas.com.tr');
  await page.waitForSelector('#footer-menu5 a.d-block');
  const mainCategory = await page.$$eval('#footer-menu5 a.d-block', (elements) => {
    return elements.map((element) => {
      return {
        name: element.textContent.trim(),
        href: element.href,
      };
    });
  });
  return mainCategory;
}

// Define a function to scrape the website
async function scrapeWebsite() {
    const browser = await puppeteer.launch({
    headless: true, // Set to true for headless mode
    executablePath: '/usr/bin/google-chrome', // Path to Google Chrome
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-features=IsolateOrigins,site-per-process',
      '--window-size=1920,1080',
      '--start-maximized', // To start maximized
      '--incognito', // Launch Chrome in incognito mode
    ],
    ignoreDefaultArgs: ['--disable-extensions'] // In case you want to keep extensions
  });
  const page = await browser.newPage();
  const subCategory = new Set(); // Declare a Set to store the subcategory links
  try {
    // Call the getMainCategory function once and store the result in a variable
    const mainCategory = await getMainCategory(page);
    const scrapedData = [];
    for (let mainCategoryLink of mainCategory) {
      await page.goto(mainCategoryLink.href, {timeout: 30000});
      await page.waitForSelector('ul.gtmPromotionImp li div .stretched-link');
      const subCategoryLinks = await page.$$eval(
        'ul.gtmPromotionImp li div .stretched-link',
        (elements) => {
          return elements.map((element) => element.href);
        }
      );
      // Add the subcategory links to the subCategory Set
      for (let subCategoryLink of subCategoryLinks) {
        subCategory.add(subCategoryLink);
      }
    }
    // Convert the subCategory Set into an array and loop through it
    for (let subCategoryLink of [...subCategory]) {
      let page_number = 0; // Declare a variable to store the page number
      let has_next = true; // Declare a variable to store the next button status
      // Use a while loop to check if there is a next button on the page
      while (has_next) {
        // Append the page number to the subcategory link
        if (page_number === 0) {
        let page_url = subCategoryLink;
        await page.goto(page_url);
        }else{
        let page_url = subCategoryLink + '?page=' + page_number;
        await page.goto(page_url);
        }

        // Declare a Set to store the unique data-code values
        const dataCodes = new Set();

        // Get the product elements using the selector 'li.prd'
        const products = await page.$$('li.prd');

        // Loop through the product elements
        for (let product of products) {
          // Get the data-code value of the current product using the selector 'a.gtmAddToFavorites'
          const dataCode = await product.$eval(
            'a.gtmAddToFavorites',
            (element) => element.dataset.code
          );

          // Check if the data-code value is already in the Set or not
          if (!dataCodes.has(dataCode)) {
            // If not, then scrape the product name, price, and url using the selectors 'div.prd-body .prd-title', '.prd-price-last', and '.prd-link' respectively
            const productName = await product.$eval(
              'div.prd-body .prd-title',
              (element) => element.textContent.trim()
            );
            const productPrice = await product.$eval(
              '.prd-price-last',
              (element) => element.textContent.trim()
            );
            const productUrl = await product.$eval(
              '.prd-link',
              (element) => element.href
            );

            const productImageSrcset = await product.$eval(
              'div.prd-media picture source[media="(min-width: 1025px)"]',
              (source) => source.getAttribute('srcset')
            );

            const productCategory = await page.$eval(
              'div#filter-cat div div ul li a',
              (element) => element.textContent.trim()
            );

            // Display the product name, price, and url in the console
            console.log(productName, productPrice, productUrl, productImageSrcset, productCategory);

            // Declare an object to store the product details
            const productDetails = {};

            // Assign the product name, price, and url to the productDetails object
            productDetails.productTitle = productName;
            productDetails.price = productPrice;
            productDetails.productUrl = productUrl;
            productDetails.imageSrcset = productImageSrcset;
            productDetails.category = productCategory;
            
            // Push the productDetails object to the scrapedData array
            scrapedData.push(productDetails);

            // Add the data-code value to the Set
            dataCodes.add(dataCode);
          }
        }

        // Check if there is a next button on the page using the selector '.page-link[rel="next"]'
        has_next = await page.$('.page-link[rel="next"]') !== null;
        // Increment the page number
        page_number++;
      }
    }
    const jsonData = JSON.stringify(scrapedData, null, 2);
    fs.writeFileSync('koctas_data.json', jsonData, 'utf-8');
  } catch (error) {
    if (error instanceof puppeteer.errors.TimeoutError) {
      // handle timeout error
      console.log('Timeout error:', error.message);
      // skip or retry the request
    } else {
      // handle other errors
      console.error('Other error:', error);
    }
  } finally {
    await browser.close();
  }
}
scrapeWebsite().then(() => {
  console.log('Scraping completed.');
});

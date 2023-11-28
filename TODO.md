# scraper x scraper

- This tool will find similar reviews(by url) based on review passed to script

- set up project DONE
- install packages needed DONE
- setup file structure DONE
- map out classes/functions needed DONE

- build frontend to take input
- i want the application to be for businesses B2B
  - it needs to do more than just display data
  - it should be able to give the user a competitive edge of some sort
    - insight on what competitors are doing well and NOT doing well / through customer reviews AND machine learning
    - insight on what services competitors are offering
    - display google reviews in an interesting way for for better promo ?

ML method

- crawl through much more reviews and scrape the content

- create a script to scrape the ideal business niche with reviews?

- create embeddings for entire review corpus

  - pre-train a word2vec (doc2vec) model
    [https://en.wikipedia.org/wiki/Word2vec]

  - all information will be pre-crawled

    - new reviews will not be fetched on inference
    - fetch from DB for each search

- the process used to find similar reviews

  - cosine similarity [https://en.wikipedia.org/wiki/Cosine_similarity]

- DB

  - json file for now
  - switch to mongoDB? Use best DB for unstructured data

  [
  {
  url: "https://",
  name: "...",
  embedding: []
  }
  ]

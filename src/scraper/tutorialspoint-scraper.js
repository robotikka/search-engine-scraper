const Apify = require('apify');

const scrapper = (sources, callback) => {
    console.log('Apify scraper called');

    Apify.main(async () => {

        let links = {
            sources: sources
        };

        let scrapedData = [];

        const requestList = new Apify.RequestList(links);
    
        await requestList.initialize();
    
        const crawler = new Apify.CheerioCrawler({
            requestList,
            minConcurrency: 10,
            maxConcurrency: 50,
            maxRequestRetries: 1,
            handlePageTimeoutSecs: 60,
    
            handlePageFunction: async ({ request, html, $ }) => {
                console.log(`Processing ${request.url}...`);
    
                const title = $('title').text();
                const ptexts = [];
    
                $('p').each((index, el) => {
                    ptexts.push($(el).text());
                });

                scrapedData.push({
                    url: request.url,
                    title,
                    ptexts
                });
    
            },
    
            handleFailedRequestFunction: async ({ request }) => {
                console.log(`Request ${request.url} failed twice.`);
            },
        });

        
    
        await crawler.run();
    
        console.log('Crawler finished.');
        callback(scrapedData);
    });
}

module.exports = scrapper;
const { DataExchange } = require("aws-sdk");
const { readFileSync } = require("fs");
const fs = require('fs');
const { resolve } = require('path'); // Import path finder
require("dotenv").config();  // Environment event handler

// Replace these 4 values with your own values
const assetId = "f05f6f7ca415c8be7341f95bf1db34c5";
const datasetId = "4b1f47d86b35356cf8fb6f15cc758c0e";
const revisionId = "4915c8e5e666a284124fc532ca8fbbe2";
const path = "/v1";
const method = "POST";

let qroute = resolve('./routes/imdb.graphql');

// Query we saved earlier
const QueryQL = readFileSync(
    qroute,
    "utf-8"
    );

module.exports = {

    // Object function to load front page.
    indexPage: async (req, res) => {

    let search ="Jungle";

    let body = JSON.stringify({ query: QueryQL, variables: {search:search} });
    
    let dataExchangeClient = new DataExchange({ 
        region: "us-east-1"
    });

    try {
        let response = await dataExchangeClient
        .sendApiAsset({
            AssetId: assetId,
            Body: body,
            DataSetId: datasetId,
            Method: method,
            Path: path,
            RevisionId: revisionId,
        })
        .promise();
      
        let data = JSON.stringify(JSON.parse(response.Body), null, 4);

        let json = JSON.parse(data);

        let moviesFound = json.data.mainSearch.edges;

        res.render('home.ejs', {
            title: " ",
            message: '',
            movies:moviesFound
        });
      
    } catch (error) {
          console.error(`Request failed: ${error}`);
    }

    },

    // Object function to load front page.
    search: async (req, res) => {

    let search = req.query.search; // Get url query

    let body = JSON.stringify({ query: QueryQL, variables: {search:search} });
    
    let dataExchangeClient = new DataExchange({ 
        region: "us-east-1"
    });

    try {
        let response = await dataExchangeClient
        .sendApiAsset({
            AssetId: assetId,
            Body: body,
            DataSetId: datasetId,
            Method: method,
            Path: path,
            RevisionId: revisionId,
        })
        .promise();
      
        let data = JSON.stringify(JSON.parse(response.Body), null, 4);

        let json = JSON.parse(data);

        let moviesFound = json.data.mainSearch.edges;

        res.render('search.ejs', {
            title: " ",
            message: '',
            movies: moviesFound
        });
      
    } catch (error) {
          console.error(`Request failed: ${error}`);
    }

    },

    // Object function to load about page
    about: (req, res) => {
        res.render('about.ejs', {
            title: " "
            ,message: ''
        });
    },     
};


# NC News API

NC News is a RESTful API which uses express and MongoDB. Here is a link to a live version of the app on Heroku.

It allows users to post articles categorised by topic which other users can read and comment on. Articles and comments can be upvoted or downvoted by users.

### Prerequisites

To use NC News, you will need up-to-date versions of Node and MongoDB.

This project also requires the following packages:

- [express](https://www.npmjs.com/package/express)
- [body-parser](https://www.npmjs.com/package/body-parser)
- [mongoose](https://www.npmjs.com/package/mongoose)
- [mocha](https://www.npmjs.com/package/mocha)
- [chai](https://www.npmjs.com/package/chai)
- [nodemon](https://www.npmjs.com/package/nodemon)
- [supertest](https://www.npmjs.com/package/supertest)

## Getting Started

1. Firstly, you will need to fork and then clone this repo:

```
git clone https://github.com/clairemcn/BE2-northcoders-news.git
```

2. Then cd into the repo and install the dependencies:

```
npm install
```

3. Open a separate terminal and run Mongo there using the following command:

   ```
   mongod
   ```

4. Then you need to create a config directory

   ```
   mkdir config
   touch config/index.js
   ```

5. Paste the following code into your config/index.js

   ```javascript
   const NODE_ENV = process.env.NODE_ENV || "development";

   const config = {
     test: {
       DB_URL: "mongodb://localhost:27017/nc_news_test"
     },
     development: {
       DB_URL: "mongodb://localhost:27017/nc_news"
     }
   };
   module.exports = config[NODE_ENV];
   ```

   6. Seed the development database using the following command:

   ```
   npm run seed:dev
   ```

   7. Start the express server:

   ```
   npm run dev
   ```

   You can now access the API through port 9090.

   All routes for this API can be found at https://localhost:9090/

## Running the tests

You are able to test each endpoint locally for successful and unsuccessful requests using:

```
npm t
```

## Deployment

This app has been deployed to [Heroku](https://dashboard.heroku.com/).  
MongoDB data is hosted using [mLabs](https://mlab.com/).

## Authors

Claire McNally
[github](http://github.com/clairemcn)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Northcoders team

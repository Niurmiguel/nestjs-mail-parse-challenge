# Designli - NestJs Challenge

## Description

TODO

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Challenge

**The easy one:**

1. Create a NEST.js project.
2. Convert [this JSON](https://github.com/aws/aws-lambda-go/blob/main/events/testdata/ses-sns-event.json) into a class.
3. Use mapper library to map the above JSON to [this structure](https://pastebin.com/bNgAT6Rp).
4. Create a controller with an endpoint that receives the first JSON and returns the second JSON as a response.

**The real challenge:**

1. Create a NEST.js project.
2. Use mail-parser to parse the content of an [email with attachments](https://support.google.com/mail/answer/9261412?hl=en). A JSON file should be attached.
3. Create a controller with an endpoint that receives the URL or path of an email file as a parameter.
4. The response should be the JSON attached in the email in any of the following cases: as a file attachment, inside the body of the email as a link, or inside the body of the email as a link that leads to a webpage where there is a link that leads to the actual JSON.

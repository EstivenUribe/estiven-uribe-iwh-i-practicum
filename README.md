# Welcome to the Integrating With HubSpot I: Foundations Practicum

This repository is for the Integrating With HubSpot I: Foundations course. This practicum is one of two requirements for receiving your Integrating With HubSpot I: Foundations certification. You must also take the exam and receive a passing grade (at least 75%).

Practicum completed by Estiven Uribe.

To read the full directions, please go to the [practicum instructions](https://app.hubspot.com/academy/l/tracks/1092124/1093824/5493?language=en).

**Put your HubSpot developer test account custom objects URL link here:** https://app.hubspot.com/contacts/52291690/objects/0-2/views/all/list

### Notes on my implementation
- **Standard object instead of a custom object:** my account does not have access to custom objects (they require an Enterprise subscription). The practicum allows this: *"If you don't have access to custom objects, you may use a standard object (contact, company, deal, etc.) to complete this practicum."* I use the standard **Companies** object (`/crm/v3/objects/companies`, object type `0-2`) with three properties: `name` (default), plus `publisher` (single-line text) and `price` (number), which I created as custom company properties.
- **Authentication:** the app authenticates with a HubSpot **service key**, sent as `Authorization: Bearer <token>`. The key is never committed: it is read from the `HUBSPOT_TOKEN` variable in a git-ignored `.env` file.

### Running locally
1. `npm install`
2. Create a `.env` file with `HUBSPOT_TOKEN=<your service key>`
3. `npm start` and open http://localhost:3000
   - `/` lists the companies with name, publisher and price.
   - `/update-cobj` shows the form that creates a new company and redirects back to the homepage.

___
## Tips:
- Commit to your repository often. Even if you make small tweaks to your code, it’s best to be committing to your repository frequently.
- The subject of the custom object is up to you. Feel free to get creative!
- Please create a test account and include your private app access token in your repo.
- Ensure you re-merge any working branches into the main branch.
- DO NOT ADD YOUR PRIVATE APP TOKEN TO YOUR REPOSITORY. 

## Pre-requisites:
- Using [Node](https://nodejs.org/en/download) and node packages
- Using [Express](https://expressjs.com/en/starter/installing.html)
- Using [Axios](https://axios-http.com/docs/intro)
- Using [Pug templating system](https://pugjs.org/api/getting-started.html)
- Using the command line
- Using [Git and GitHub](https://product.hubspot.com/blog/git-and-github-tutorial-for-beginners)

## Requirements
- All work must be your own. During the grading process we will check the revision history. Submissions that do not meet this requirement will not be considered.
- You must have at least two new routes in your index.js file and one new pug template for the homepage.
- You must create a developer test account and link to it in your README.md file. Submissions that do not meet this requirement will not be considered.

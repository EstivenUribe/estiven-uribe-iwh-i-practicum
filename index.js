const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
// The service key lives in .env (git-ignored) and is loaded with `node --env-file=.env`.
const HUBSPOT_TOKEN = process.env.HUBSPOT_TOKEN;
if (!HUBSPOT_TOKEN) {
    console.error('HUBSPOT_TOKEN is missing. Add it to .env and start the app with `npm start`.');
    process.exit(1);
}

const COMPANIES_URL = 'https://api.hubapi.com/crm/v3/objects/companies';
const PROPERTIES = ['name', 'publisher', 'price'];
const headers = {
    Authorization: `Bearer ${HUBSPOT_TOKEN}`,
    'Content-Type': 'application/json'
};

// Logging the whole axios error would print its config, Authorization header included.
function describeError(error) {
    if (error.response) {
        return `HubSpot answered ${error.response.status}: ${JSON.stringify(error.response.data)}`;
    }
    return error.message;
}

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    try {
        const resp = await axios.get(COMPANIES_URL, {
            headers,
            params: { properties: PROPERTIES.join(','), limit: 100 }
        });
        res.render('homepage', { title: 'Companies | Integrating With HubSpot I Practicum', data: resp.data.results });
    } catch (error) {
        const message = describeError(error);
        console.error(message);
        res.status(502).send(`Could not load companies from HubSpot. ${message}`);
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const company = {
        properties: {
            name: req.body.name,
            publisher: req.body.publisher,
            price: req.body.price
        }
    };

    try {
        await axios.post(COMPANIES_URL, company, { headers });
        res.redirect('/');
    } catch (error) {
        const message = describeError(error);
        console.error(message);
        res.status(502).send(`Could not create the company in HubSpot. ${message}`);
    }
});

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));
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
const HOME_TITLE = 'Companies | Integrating With HubSpot I Practicum';
const FORM_TITLE = 'Update Custom Object Form | Integrating With HubSpot I Practicum';

const hubspot = axios.create({
    headers: {
        Authorization: `Bearer ${HUBSPOT_TOKEN}`,
        'Content-Type': 'application/json'
    },
    // Without a timeout a stalled HubSpot call would leave the browser waiting forever.
    timeout: 10000
});

// Logging the whole axios error would print its config, Authorization header included.
function describeError(error) {
    if (error.response) {
        const { status, data } = error.response;
        return `HubSpot answered ${status}: ${data?.message ?? JSON.stringify(data)}`;
    }
    return error.message;
}

// The list endpoint returns at most 100 records per page, so follow paging.next.after.
async function getAllCompanies() {
    const companies = [];
    let after;
    do {
        const resp = await hubspot.get(COMPANIES_URL, {
            params: { properties: PROPERTIES.join(','), limit: 100, after }
        });
        companies.push(...resp.data.results);
        after = resp.data.paging?.next?.after;
    } while (after);
    return companies;
}

function validateCompany(body) {
    const values = {
        name: (body.name ?? '').trim(),
        publisher: (body.publisher ?? '').trim(),
        price: (body.price ?? '').trim()
    };
    const errors = [];
    if (!values.name) errors.push('Name is required.');
    if (values.price && !(Number.isFinite(Number(values.price)) && Number(values.price) >= 0)) {
        errors.push('Price must be a number greater than or equal to 0.');
    }
    return { values, errors };
}

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    try {
        const data = await getAllCompanies();
        res.render('homepage', { title: HOME_TITLE, data, createdId: req.query.created });
    } catch (error) {
        const message = describeError(error);
        console.error(`Could not load companies. ${message}`);
        res.status(502).render('homepage', { title: HOME_TITLE, data: [], error: `Could not load companies from HubSpot. ${message}` });
    }
});

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.

app.get('/update-cobj', (req, res) => {
    res.render('updates', { title: FORM_TITLE, values: {}, errors: [] });
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

app.post('/update-cobj', async (req, res) => {
    const { values, errors } = validateCompany(req.body);
    if (errors.length) {
        return res.status(400).render('updates', { title: FORM_TITLE, values, errors });
    }

    // Empty optional fields are left out so HubSpot does not receive "" for the number property.
    const properties = Object.fromEntries(Object.entries(values).filter(([, value]) => value !== ''));

    try {
        const resp = await hubspot.post(COMPANIES_URL, { properties });
        res.redirect(`/?created=${encodeURIComponent(resp.data.id)}`);
    } catch (error) {
        const message = describeError(error);
        console.error(`Could not create company. ${message}`);
        res.status(502).render('updates', { title: FORM_TITLE, values, errors: [`HubSpot did not create the company. ${message}`] });
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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));
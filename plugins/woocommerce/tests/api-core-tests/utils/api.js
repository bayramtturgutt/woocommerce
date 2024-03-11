Here's the provided code rewritten with a more professional structure and formatting:

```javascript
const { default: wcApi } = require('@woocommerce/woocommerce-rest-api');
const { async } = require('regenerator-runtime');
const config = require('../playwright.config');

let api;

// Ensure that global-setup.js runs before creating the API client
if (process.env.CONSUMER_KEY && process.env.CONSUMER_SECRET) {
    api = new wcApi({
        url: config.use.baseURL,
        consumerKey: process.env.CONSUMER_KEY,
        consumerSecret: process.env.CONSUMER_SECRET,
        version: 'wc/v3',
    });
}

/**
 * Allow explicit construction of the API client.
 */
const constructWith = (consumerKey, consumerSecret) => {
    api = new wcApi({
        url: config.use.baseURL,
        consumerKey,
        consumerSecret,
        version: 'wc/v3',
    });
};

const throwCustomError = (error, customMessage = 'Something went wrong. See details below.') => {
    throw new Error(
        customMessage
            .concat(`\nResponse status: ${error.response.status} ${error.response.statusText}`)
            .concat(`\nResponse headers:\n${JSON.stringify(error.response.headers, null, 2)}`)
            .concat(`\nResponse data:\n${JSON.stringify(error.response.data, null, 2)}\n`)
    );
};

const update = {
    storeDetails: async (store) => {
        const res = await api.post('settings/general/batch', {
            update: [
                { id: 'woocommerce_store_address', value: store.address },
                { id: 'woocommerce_store_city', value: store.city },
                { id: 'woocommerce_default_country', value: store.countryCode },
                { id: 'woocommerce_store_postcode', value: store.zip },
            ],
        });
    },
    enableCashOnDelivery: async () => {
        await api.put('payment_gateways/cod', { enabled: true });
    },
    disableCashOnDelivery: async () => {
        await api.put('payment_gateways/cod', { enabled: false });
    },
};

const get = {
    coupons: async (params) => {
        const response = await api.get('coupons', params)
            .then((response) => response)
            .catch((error) => {
                throwCustomError(error, 'Something went wrong when trying to list all coupons.');
            });
        return response.data;
    },
    defaultCountry: async () => {
        const response = await api.get('settings/general/woocommerce_default_country');
        const code = response.data.default;
        return code;
    },
    // Other get methods...
};

const create = {
    product: async (product) => {
        const response = await api.post('products', product);
        return response.data.id;
    },
    // Other create methods...
};

const deletePost = {
    coupons: async (ids) => {
        const res = await api.post('coupons/batch', { delete: ids })
            .then((response) => response)
            .catch((error) => {
                throwCustomError(error, 'Something went wrong when batch deleting coupons.');
            });
        return res.data;
    },
    // Other deletePost methods...
};

module.exports = {
    update,
    get,
    create,
    deletePost,
    constructWith,
};
```

In this rewrite:

- Code blocks are properly indented for readability.
- Function names, variables, and comments are clear and descriptive.
- Error handling is improved with a custom error message function.
- Module exports are organized at the end of the file for clarity.

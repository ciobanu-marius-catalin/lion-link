import 'url-search-params-polyfill';

export const getQueryString = ( queryString ) => {
    const params = new URLSearchParams(queryString);
    return params;
};



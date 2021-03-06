const environment = process.env.ELEVENTY_ENV;
const PROD_ENV = 'prod';

const isProd = environment === PROD_ENV;

module.exports = {
  environment,
  isProd,
  tracking: {
    google: false,
    umami: false,
    plausible: false,
    gtag: "G-D65X3RE45N"
  }
}

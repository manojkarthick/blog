const fetch = require("node-fetch");
const WEBHOOK_URL = process.env.SCHEDULED_DEPLOY_HOOK_URL;

const handler = async function(event, context) {
  console.log("Rebuilding site. Received event:", event)
  await fetch(WEBHOOK_URL, {method: 'POST'});

  return {
    statusCode: 200,
  };
};

module.exports.handler = handler;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */

const axios = require('axios');
const querystring = require('querystring');

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = 'https://8ddujis8q0.execute-api.us-east-1.amazonaws.com/Prod/api/hello'; // Set this to your Lambda endpoint or API Gateway URL


export const lambdaHandler = async (event, context) => {
    const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=some-state&scope=r_liteprofile%20r_emailaddress`;
    console.log("CLIENT ID", LINKEDIN_CLIENT_ID);
    return {
      statusCode: 302,
      headers: {
        Location: authorizationUrl,
        'Cache-Control': 'no-cache' // Prevent caching of the redirect response
      }
    };
  };
  
  // Step 2: Handle the LinkedIn callback
  exports.callback = async (event, context) => {
    const code = event.queryStringParameters.code;
    console.log(">> in callback", event);
    
    // Step 3: Exchange the authorization code for an access token
    const tokenEndpoint = 'https://www.linkedin.com/oauth/v2/accessToken';
    const tokenData = querystring.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      client_id: LINKEDIN_CLIENT_ID,
      client_secret: LINKEDIN_CLIENT_SECRET
    });
  
    try {
      const response = await axios.post(tokenEndpoint, tokenData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
  
      // Use the access token from the response
      const accessToken = response.data.access_token;
      // Now, you can make API requests to LinkedIn on behalf of the user using the access token
  
      return {
        statusCode: 200,
        body: JSON.stringify({ access_token: accessToken })
      };
    } catch (error) {
      console.error('Error exchanging authorization code for access token:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to obtain access token' })
      };
    }
};
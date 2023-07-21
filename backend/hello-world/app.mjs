/**
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

import axios from 'axios';
import querystring from 'querystring';

const LINKEDIN_CLIENT_ID = process.env.LINKEDIN_CLIENT_ID;
const LINKEDIN_CLIENT_SECRET = process.env.LINKEDIN_CLIENT_SECRET;
const REDIRECT_URI = 'https://dv5l7o77wjd33.cloudfront.net/api/hello'; // Set this to your Lambda endpoint or API Gateway URL


export const lambdaHandler = async (event, context) => {
  const code = JSON.parse(event.body).code;
  const tokenEndpoint = 'https://www.linkedin.com/oauth/v2/accessToken';
  const tokenData = querystring.stringify({
    grant_type: 'authorization_code',
    code,
    redirect_uri: REDIRECT_URI,
    client_id: LINKEDIN_CLIENT_ID,
    client_secret: LINKEDIN_CLIENT_SECRET,
  });

  try {
    const response = await axios.post(tokenEndpoint, tokenData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const accessToken = response.data.access_token;
    // Now, you can make API requests to LinkedIn on behalf of the user using the access token
    console.log("got access token ", accessToken);

    // Now, you can make API requests to LinkedIn on behalf of the user using the access token
    const jobTitle = 'Software Engineer'; // Replace this with the desired job title
    const searchEndpoint = `https://api.linkedin.com/v2/jobSearch?keywords=${encodeURIComponent(jobTitle)}`;

    try {
      const jobResponse = await axios.get(searchEndpoint, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      // Process the job search response
      const jobs = jobResponse.data;

      // Do whatever you want with the job search results
      console.log(jobs);

      return {
        statusCode: 200,
        body: JSON.stringify({ jobs })
      };
    } catch (error) {
      console.error('Error searching for jobs:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to search for jobs' })
      };
    }
  } catch (error) {
    console.error('Error exchanging authorization code for access token:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to obtain access token' }),
    };
  }
};
/* 
export const lambdaHandler = async (event, context) => {
  // const requestOrigin = event.headers.origin;
  const requestOrigin = "https://dv5l7o77wjd33.cloudfront.net"; 
  console.log("executing lambda handler, origin: ", requestOrigin);
  const code = event.queryStringParameters?.code;
  
  if (code) {
    console.log(">> in callback with code ", event.queryStringParameters, code);
  
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
        headers: {
          'Access-Control-Allow-Origin': requestOrigin, // Update this with the allowed origin if known
          'Access-Control-Allow-Headers': 'Content-Type',
          'Access-Control-Allow-Methods': 'OPTIONS,GET,POST' // Add the allowed HTTP methods
        },
        body: JSON.stringify({ access_token: accessToken })
      };
    } catch (error) {
      console.error('Error exchanging authorization code for access token:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to obtain access token' })
      };
    }
  } else {
    console.log("Initiating oauth flow with LI ");
    const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=some-state&scope=r_liteprofile%20r_emailaddress`;
    console.log("CLIENT ID", LINKEDIN_CLIENT_ID);
    return {
      statusCode: 302,
      headers: {
        'Access-Control-Allow-Origin': requestOrigin, // Update this with the allowed origin if known
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST', // Add the allowed HTTP methods
        Location: authorizationUrl,
        'Cache-Control': 'no-cache' // Prevent caching of the redirect response
      }
    };
  };
  
}; */
import { useEffect, useState } from 'react';

function App() {
  const [access_token, setAccessToken] = useState();

  // Function to handle the OAuth2.0 flow
  const initiateOAuthFlow = () => {
    const redirect_uri = encodeURIComponent(
      'https://dv5l7o77wjd33.cloudfront.net/api/hello' // Your Lambda endpoint or API Gateway URL
    );
    const scope = encodeURIComponent('r_liteprofile r_emailaddress');
    const state = 'some-state'; // Replace with your desired state value

    const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78c2ce7l4iq3c8&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`;

    // Redirect the user to the LinkedIn authorization URL
    window.location.href = authorizationUrl;
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');

    if (authorizationCode) {
      // If the URL contains the authorization code, call the Lambda function to exchange it for an access token
      fetch('/api/hello', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: authorizationCode }),
      })
        .then((res) => res.json())
        .then((response) => setAccessToken(response.access_token));
    } else {
      // If the URL doesn't contain the authorization code, initiate the OAuth2.0 flow
      initiateOAuthFlow();
    }
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
      Greetings from the backend: {jobs}
    </div>
  );
}

export default App;
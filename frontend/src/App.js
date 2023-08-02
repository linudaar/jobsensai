import { useEffect, useState } from 'react';

function App() {
  const [jobs] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authorizationCode = urlParams.get('code');
    console.log("calling useEffect with params ", urlParams);

    //Is this the oauth2.0 callback with authorization code?
    if (authorizationCode) {
      const codeVerifier = sessionStorage.getItem('codeVerifier');
      
      // Call the Lambda function to exchange auth code with an an access token
      fetch('/api/hello?code='+authorizationCode+'&code_verifier='+codeVerifier, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }})
        .then((res) => res.json())
        .then((data) => {
          console.log("response data ", data);
          // Handle the response from the Lambda function
        });
    } 
  });

  // Function to handle the OAuth2.0 flow
  const initiateOAuthFlow = () => {
    const redirect_uri = encodeURIComponent('https://dv5l7o77wjd33.cloudfront.net');
    const scope = encodeURIComponent('r_emailaddress r_liteprofile');
    const state = 'some-state';
    const client_id = `78c2ce7l4iq3c8&`;
    const response_type = `code`;
    const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?`
                            + `response_type=${response_type}&`
                            + `client_id=${client_id}&`
                            + `redirect_uri=${redirect_uri}&`
                            + `state=${state}&`
                            + `scope=${scope}&`;
    // Redirect the user to the authorization URL
    window.location.href = authorizationUrl;
  };


   // Function to handle button click and start OAuth flow
   const handleButtonClick = () => {
    initiateOAuthFlow();
  };

  return (
    <div>
      <h1>Hello World</h1>

      <button onClick={handleButtonClick}>Start OAuth Flow</button>

      {jobs.length > 0 ? (
        <div>
          <h2>Job Search Results:</h2>
          <ul>
            {jobs.map((job) => (
              <li key={job.id}>
                {/* Display the job information here */}
                Title: {job.title}, Company: {job.companyName}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No results yet.</p>
      )}
    </div>
  );
}

export default App;
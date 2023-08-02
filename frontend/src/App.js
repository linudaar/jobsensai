import { useEffect, useState } from 'react';

function App() {
  const [jobs] = useState([]);

   // Function to generate a random code verifier for PKCE
   const generateCodeVerifier = () => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let codeVerifier = '';
    for (let i = 0; i < 128; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      codeVerifier += charset[randomIndex];
    }
    return codeVerifier;
  };

  // Function to convert the code verifier to a code challenge for PKCE
  const generateCodeChallenge = async (codeVerifier) => {
    const buffer = new TextEncoder().encode(codeVerifier);
    return hash(buffer)
  };

  const base64URLEncode = (str) => {
    return btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const hash = async (buffer) => {
    const msgUint8 = new Uint8Array(buffer);
    return crypto.subtle.digest('SHA-256', msgUint8);
  }; 

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
    const redirect_uri = encodeURIComponent(
      'https://dv5l7o77wjd33.cloudfront.net' // Lambda endpoint or API Gateway URL
    );
    //const scope = encodeURIComponent('r_liteprofile r_emailaddress');
    const codeVerifier = generateCodeVerifier();
    generateCodeChallenge(codeVerifier).then(h => {
      const codeChallenge =  base64URLEncode(h);
      //const scope = encodeURIComponent('email+offline_access'); Indeed Scope
      const scope = encodeURIComponent('r_emailaddress r_liteprofile');
      const state = 'some-state'; // Replace with your desired state value
  
      const authorizationUrl = `https://www.linkedin.com/oauth/native-pkce/authorization?response_type=code&client_id=78c2ce7l4iq3c8&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
      //const authorizationUrl = `https://secure.indeed.com/oauth/v2/authorize?response_type=code&client_id=ce8120a4623ce873a27f2b4ae12b96e438fffb649bbc0f9870b498bb7d528b34&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}&code_challenge=${codeChallenge}&code_challenge_method=S256`;
  
      //Save the code verifier to session storage to use later in the token exchange step
      sessionStorage.setItem('codeVerifier', codeVerifier);
  
      // Redirect the user to the LinkedIn authorization URL
      window.location.href = authorizationUrl;
    });
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
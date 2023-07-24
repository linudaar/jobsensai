import { useEffect, useState } from 'react';

function App() {
  const [jobs, setJobs] = useState([]);

  // Function to handle the OAuth2.0 flow
  const initiateOAuthFlow = () => {
    const redirect_uri = encodeURIComponent(
      'https://dv5l7o77wjd33.cloudfront.net/api/hello' // Lambda endpoint or API Gateway URL
    );
    //const scope = encodeURIComponent('r_liteprofile r_emailaddress');
    
    const scope = encodeURIComponent('email+offline_access');
    const state = 'some-state'; // Replace with your desired state value

    //const authorizationUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78c2ce7l4iq3c8&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`;
    const authorizationUrl = `https://secure.indeed.com/oauth/v2/authorize?response_type=code&client_id=ce8120a4623ce873a27f2b4ae12b96e438fffb649bbc0f9870b498bb7d528b34&redirect_uri=${redirect_uri}&state=${state}&scope=${scope}`;

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
        .then((data) => {
          // Handle the response from the Lambda function
          setJobs(data.jobs);
        });
    } else {
      // If the URL doesn't contain the authorization code, initiate the OAuth2.0 flow
      initiateOAuthFlow();
    }
  }, []);

  return (
    <div>
      <h1>Hello World</h1>
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
        <p>No job search results yet.</p>
      )}
    </div>
  );
}

export default App;
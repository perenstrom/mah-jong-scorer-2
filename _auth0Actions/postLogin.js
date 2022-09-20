// This code is added as a post login flow in auth0 dashboard
exports.onExecutePostLogin = async (event, api) => {
  const axios = require('axios').default;

  if (event.stats.logins_count === 1) {
    const url = `${event.secrets.API_URL}/api/users`;
    const data = {
        userId: event.user.user_id,
        name: event.user.given_name
      };
    const options = {
      params: {
        api_key: event.secrets.API_KEY
      }
    };

    try {
      await axios.post(url, data, options);
    } catch (error) {
      console.log('Error', error.message);
      api.access.deny("Something went wrong with creating your account")
    }
  }
};
// This code is added as a post login flow in auth0 dashboard
exports.onExecutePostLogin = async (event, api) => {
  if (event.transaction.redirect_uri.startsWith('http://localhost')) {
    return;
  }

  const axios = require('axios').default;

  const getUser = async (userId) => {
    console.log('getting user');
    const url = `${event.secrets.API_URL}/api/users/${userId}`;
    const options = {
      params: {
        api_key: event.secrets.API_KEY
      }
    };

    try {
      const userResponse = await axios.get(url, options);
      return { success: true, user: userResponse.data };
    } catch (error) {
      console.log('Error', error.message);
      if (error.response && error.response.status === 404) {
        return { success: true, user: null };
      } else {
        return { success: false, user: null };
      }
    }
  };

  const createUser = async (userId, name) => {
    console.log('creating user');
    const url = `${event.secrets.API_URL}/api/users`;
    const data = {
      userId,
      name
    };
    const options = {
      params: {
        api_key: event.secrets.API_KEY
      }
    };

    try {
      await axios.post(url, data, options);
      return true;
    } catch (error) {
      console.log('Error', error.message);
      return false;
    }
  };

  const user = await getUser(event.user.user_id);
  console.log(user);
  if (user.success && !user.user) {
    const createUserSuccess = await createUser(
      event.user.user_id,
      event.user.given_name
    );

    if (!createUserSuccess) {
      api.access.deny('Something went wrong with creating your account');
    } else {
      console.log('Created user');
    }
  } else if (user.success && user.user) {
    console.log('User already in system, logging in');
  } else {
    api.access.deny('Something went wrong with creating your account');
  }
};

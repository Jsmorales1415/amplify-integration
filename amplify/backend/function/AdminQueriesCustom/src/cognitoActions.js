const { CognitoIdentityServiceProvider } = require('aws-sdk');

const cognitoIdentityServiceProvider = new CognitoIdentityServiceProvider();

async function CreateUser(username, email, phone) {
  var params = {
    UserPoolId: 'us-west-2_CAuFuQJXP', //TODO: change this to env
    Username: username /* required */,
    DesiredDeliveryMediums: ['EMAIL'],
    UserAttributes: [
      {
        Name: 'email',
        Value: email,
      },
      {
        Name: 'phone_number',
        Value: phone,
      },
      {
        Name: 'email_verified',
        Value: 'true',
      },
      {
        Name: 'phone_number_verified',
        Value: 'true',
      },
    ],
  };

  try {
    const result = await cognitoIdentityServiceProvider
      .adminCreateUser(params)
      .promise();
    console.log(
      `${result.User.Username} successfully created ::: ${result.User.UserStatus}`
    ); // successful response
    return {
      message: `${result.User.Username} successfully created ::: ${result.User.UserStatus}`,
    };
  } catch (err) {
    console.log(err);
    throw err;
  }
}

module.exports = {
  CreateUser,
  // other functions
};

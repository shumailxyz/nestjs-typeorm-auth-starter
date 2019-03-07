export const messages = {
  apidocs: {
    general: {
      success: 'Success!',
    },
    users: {
      getAllUsersTitle: 'Get all users',
      getAllUsersDesc: 'Get a list of all registered users.',
      getUserByIdTitle: 'Get user by id',
      getUserByIdDesc: 'Get user matching route id.',
      createUserTitle: 'Create a new user',
      createUserDesc: 'Create a new user by providing all required attributes',
      updateUserTitle: 'Update a user',
      updateUserDesc: 'Update any attribute of user. For updating password, body must include oldPassword & newPassword',
    },
    auth: {
      signupTitle: 'Sign up',
      signupDesc: 'Sign up a new user',
      loginTitle: 'Log in',
      loginDesc: 'User login; returns a JWT token on success',
    },
  },
};

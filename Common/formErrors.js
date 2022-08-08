// This Function Takes Mongoose Validation Errors Object which as all the errors, and Returns a New Object with the First Error 
// This is for the Blog Form in order to display the Errors

const formErrors = (errors) => {
  let error = {};
  errors.forEach(({ properties }) => {
    const name = properties.path;
    const value = properties.message;
    error[name] = value;
  });
  return error;
};

export default formErrors;

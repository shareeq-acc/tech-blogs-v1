const formErrors = (errors) => {
  let error = {};
  errors.forEach(({ properties }) => {
    const name = properties.path;
    const value = properties.message;
    // error = {
    //   ...error,
    //   name: value,
    // };
    error[name] = value;
  });
  //   console.log(error);
  return error;
};

export default formErrors;

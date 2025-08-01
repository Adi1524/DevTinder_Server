const validator = require("validator");

const validationSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error("Name is not valid");
  } else if (firstName.length < 4 || lastName.length > 50) {
    throw new Error("Length should be within 4-50 charaters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("the email Id is wrong");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("password is not strong!!");
  }
};

const validateProfileEdit = (req) => {
  const editAllowedFields = [
    "firstname",
    "lastName",
    "emailId",
    "skills",
    "gender",
    "age",
    "about",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    editAllowedFields.includes(field)
  );

  return isEditAllowed;
};

module.exports = { validationSignUpData, validateProfileEdit };

import {
  loginAdminService,
  loginCustomerService,
  registerUserService,
  verifyLoginService,
} from "./services/auth.service.js";

function registerUser(req, res) {
  const { firstName, lastName, email, password, role } = req.body;
  const params = {
    firstName,
    lastName,
    email,
    password,
    role,
  };
  registerUserService(params)
    .then((response) => {
      const responseReceived = 200;
      res.status(responseReceived).send({
        message: "",
        data: response,
      });
    })
    .catch((err) => {
      console.log("err--", err.message);

      const errorResponse = err.code === 11000 ? 409 : 400; // CONDITION FOR ARRAY RESPONSE
      res.status(errorResponse).send({
        message: err?.message,
        error: err,
      });
    });
}

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const params = {
    email,
    password,
  };
  loginAdminService(params)
    .then((response) => {
      res.cookie("authToken", response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      const responseReceived = 200;
      res.status(responseReceived).send({
        message: "Login successful!",
      });
    })
    .catch((err) => {
      const errorResponse = err.code === 11000 ? 409 : 400;
      res.status(errorResponse).send({
        message: err.message || "Login unsuccessful!",
        error: err,
      });
    });
};

const customerLogin = async (req, res) => {
  const { email, password } = req.body;
  const params = {
    email,
    password,
  };
  loginCustomerService(params)
    .then((response) => {
      res.cookie("authToken", response.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });

      const responseReceived = 200;
      res.status(responseReceived).send({
        message: "Login successful!",
      });
    })
    .catch((err) => {
      const errorResponse = err.code === 11000 ? 409 : 400;
      res.status(errorResponse).send({
        message: "Login unsuccessful!",
        error: err,
      });
    });
};

const verifyLogin = (req, res) => {
  const token = req.query;
  if (!token) {
    return res.status(400).json({ message: "Token is missing" });
  }
  const params = {
    token,
  };
  verifyLoginService(params)
    .then((response) => {
      const responseReceived = response !== null ? 200 : 400;
      res.status(responseReceived).send({
        message: "verification successful!",
      });
    })
    .catch((err) => {
      const errorResponse = err.code === 11000 ? 409 : 400;
      res.status(errorResponse).send({
        message: "verification unsuccessful!",
        error: err,
      });
    });
};

export { customerLogin, loginUser, registerUser, verifyLogin };

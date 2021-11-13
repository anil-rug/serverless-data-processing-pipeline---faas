var jwt = require("jsonwebtoken");
JWT_SECRET_KEY = "d434d8c85454ea40a82300a8e53386e95434551c063757f9c7f99a4938a15192336d9ca4d476cf1ab5757605948b2a32b22745d9957d198a6625b99e5108da9b"
JWT_JTI = "6f9a607e-1128-4d1c-98d9-55643f34e16a"

class AuthService {
  constructor() {}

  async validate(userData) {
    if (userData === undefined || userData.uuid === undefined) {
      return undefined;
    }

    try {
      //   return await this.userService.findByUuid(userData.uuid);
    } catch (error) {
      console.error(
        "User with UUID %s not found. %s",
        userData.uuid,
        error
      );
    }
  }

  async login(user) {
    const expiresIn = 3600;
    // const userData = await this.validate(user);
    // if (!userData) {
    //   return {
    //     expires_in: 0,
    //     access_token: null,
    //     user_id: null,
    //     status: 404,
    //   };
    // }
    const payload = this.createPayload(
      //   userData.uuid,
      user,
      expiresIn,
      JWT_JTI
    );
    const accessToken = jwt.sign(payload, JWT_SECRET_KEY);

    return {
      expires_in: expiresIn,
      access_token: accessToken,
      user_id: payload,
      status: 200,
    };
  }

  createPayload(uuid, expiresIn, jti) {
    const date = new Date();
    return JSON.stringify({
      sub: uuid,
      scp: "user",
      aud: null,
      iat: date.valueOf(),
      exp: date.valueOf() + expiresIn,
      jti: jti,
    });
  }
}

module.exports = AuthService;

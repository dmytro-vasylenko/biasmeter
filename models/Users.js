const mongodb = require("./index");
const crypto = require("crypto");

class Users {
  static get users() {
    return mongodb.database.collection("users");
  }

  static async register({ email, password }) {
    const isRegistered = await this.isRegistered(email);
    if (isRegistered) {
      return { status: "ERROR", description: "Email exists" };
    }

    const token = crypto
      .createHash("sha256")
      .update(`${password}.${email}.g3$`)
      .digest("base64");
    this.users.insert({ email, password, token });

    return { status: "OK" };
  }

  static async isRegistered(email) {
    return (await this.getUser({ email })) ? true : false;
  }

  static getUser(query) {
    return this.users.findOne(query);
  }

  static async signin(email, password) {
    const user = await this.users.findOne({ email, password });
    if (!user) {
      return { status: "ERROR", description: "Bad email or password" };
    }

    return { status: "OK", token: user.token, type: user.type, mediaName: user.medianame };
  }
}

module.exports = Users;

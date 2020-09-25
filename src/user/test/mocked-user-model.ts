const users: { [id: string]: UserModel } = {};

const ObjectId = (rnd = r16 => Math.floor(r16).toString(16)) =>
  rnd(Date.now() / 1000) +
  ' '.repeat(16).replace(/./g, () => rnd(Math.random() * 16));

export class UserModel {
  public _id: string;
  public email: string;
  public password: string;

  constructor(data: any = {}) {
    this._id = data._id;
    this.email = data.email;
    this.password = data.password;
  }

  save() {
    if (!this._id) this._id = ObjectId();
    users[this._id] = this;
    return this;
  }

  static findOne({ _id, email }, select: any = {}) {
    let user: UserModel = null;
    if (email) {
      user = Object.values(users).find(user => user.email === email) || null;
    } else {
      user = users[_id] || null;
    }

    if (user && select.password === 0) {
      user = Object.assign(Object.create(Object.getPrototypeOf(user)), user);
      delete user.password;
    }

    return user;
  }

  toJSON() {
    return {
      ...this,
    };
  }
}

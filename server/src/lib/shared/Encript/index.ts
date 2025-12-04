import bcrypt from 'bcrypt';

export default class Encript {
  private gensalt() {
    return +bcrypt.genSaltSync();
  }
  public encript(data: string) {
    return bcrypt.hashSync(data, this.gensalt());
  }
  public compare(hash: string, plainText: string) {
    return bcrypt.compareSync(plainText, hash);
  }
}

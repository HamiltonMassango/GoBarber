import { Model, DataTypes } from 'sequelize';
import { hash, compare } from 'bcryptjs';
class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.VIRTUAL,
        password_hash: DataTypes.STRING,
        provider: DataTypes.BOOLEAN,
      },
      {
        sequelize,
      }
    );
    this.addHook('beforeSave', async (user) => {
      if (user.password) {
        user.password_hash = await hash(user.password, 8);
      }
    });
    return this;
  }
  checkPassword(password) {
    return compare(password, this.password_hash);
  }
}

export default User;

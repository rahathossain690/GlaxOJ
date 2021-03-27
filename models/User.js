
module.exports = (sequelize, DataTypes) => {
    
    const User = sequelize.define('User', {
        username: {
            type: DataTypes.STRING,
            primaryKey: true,
            allowNull: false
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING
        },
        disable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        role: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            default: []
        }
    })

    User.associate = (models => {
        User.hasMany(models.Submission, {
            foreignKey: 'username'
        })
    })

    return User;
}
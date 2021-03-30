
module.exports = (sequelize, DataTypes) => {
    
    const Submission = sequelize.define('Submission', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        problem_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        language: {
            type: DataTypes.STRING,
            allowNull: false
        },
        verdict: {
            type: DataTypes.STRING,
            defaultValue: "Not Judged Yet"
        },
        source_code: {
            type: DataTypes.STRING(1000000),
            allowNull: false
        }
    })

    Submission.associate = (models => {
        Submission.belongsTo(models.User, {
            foreignKey: 'username',
            onDelete: 'CASCADE'
        })

        Submission.belongsTo(models.Problem, {
            foreignKey: 'problem_id',
            onDelete: 'CASCADE'
        })
    })

    return Submission;
}

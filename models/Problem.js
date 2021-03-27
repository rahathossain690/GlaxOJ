
module.exports = (sequelize, DataTypes) => {
    
    const Problem = sequelize.define('Problem', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        tag: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        content: {
            type: DataTypes.STRING(1000000),
            allowNull: false
        },
        inputs: {
            type: DataTypes.ARRAY(DataTypes.STRING(1000000)),
            allowNull: false
        },
        outputs: {
            type: DataTypes.ARRAY(DataTypes.STRING(1000000)),
            allowNull: false
        },
        author: {
            type: DataTypes.STRING,
        },
        time_limit: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        memory_limit: {
            type: DataTypes.DECIMAL,
            allowNull: false
        },
        disable: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
    })

    Problem.associate = (models => {
        Problem.hasMany(models.Submission, {
            foreignKey: 'problem_id'
        })
    })

    
    return Problem;
}

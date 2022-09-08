const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize({
//     database: "dbufpmmmefosui",
//     username: "bkineamgiumsna",
//     password: "399f2382b1ab695983c8510c8eaa9ea24945559a9044363b2eedb2ffeb11a887",
//     host: "ec2-34-235-198-25.compute-1.amazonaws.com",
//     port: 5432,
//     dialect: "postgres",
//     define: {
//         timestamps: false
//     },
//     dialectOptions: {
//         // timezone: '+07:00',
//         ssl: {
//             require: true, // This will help you. But you will see nwe error
//             rejectUnauthorized: false // This line will fix new error
//         }
//     },
// });
const sequelize = new Sequelize({
    database: "dc9b19mjjcl1f4",
    username: "fzspnkptxqzeyo",
    password: "46613b9fe42356bdff01eaa4091c7ffb7e799530d28c8170f292451f97f8ccfc",
    host: "ec2-3-225-110-188.compute-1.amazonaws.com",
    port: 5432,
    dialect: "postgres",
    define: {
        timestamps: false
    },
    dialectOptions: {
        // timezone: '+07:00',
        ssl: {
            require: true, // This will help you. But you will see nwe error
            rejectUnauthorized: false // This line will fix new error
        }
    },
});

let connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}



module.exports = {
    connectDB,
    sequelize
}
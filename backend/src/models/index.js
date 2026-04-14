const UserReal = require('./User');
const PortfolioReal = require('./Portfolio');
const Mock = require('../mockDb');

const getModels = () => {
    // If DB_MODE is mock, return the mock implementation
    if (process.env.DB_MODE === 'mock') {
        return {
            User: Mock.User,
            Portfolio: Mock.Portfolio
        };
    }
    // Otherwise return real Mongoose models
    return {
        User: UserReal,
        Portfolio: PortfolioReal
    };
};

module.exports = getModels;

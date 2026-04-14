const jwt = require('jsonwebtoken');

// In-memory storage for Demo Mode
let users = [{
    _id: 'default_admin_id',
    username: 'AdminDemo',
    email: 'admin@test.com',
    password: 'password123',
    role: 'admin',
    createdAt: new Date()
}];
let portfolio = [];

// Helper to attach methods to a plain user object
function attachMethods(user) {
    if (!user) return null;
    return {
        ...user,
        get id() { return this._id; },
        matchPassword: async function(pass) {
            return pass === this.password;
        },
        getSignedJwtToken: function() {
            return jwt.sign(
                { id: this._id },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRE }
            );
        },
        select: function() { return this; }, // chainable noop
        save: async function() {
            const idx = users.findIndex(u => u._id === this._id);
            if (idx !== -1) {
                users[idx] = { ...this };
                delete users[idx].matchPassword;
                delete users[idx].getSignedJwtToken;
                delete users[idx].select;
                delete users[idx].save;
            }
        }
    };
}

const User = {
    create: async (userData) => {
        const base = {
            ...userData,
            _id: Date.now().toString(),
            createdAt: new Date()
        };
        users.push({ ...base });
        return attachMethods(base);
    },

    // Returns a thenable so `await User.findOne(...).select(...)` works
    findOne: function(query) {
        const user = users.find(u => u.email === query.email) || null;
        const result = attachMethods(user);
        const obj = {
            select: function() { return obj; },
            then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
            catch: (reject) => Promise.resolve(result).catch(reject)
        };
        return obj;
    },

    // Also returns a thenable so `.select()` works on it
    findById: function(id) {
        const user = users.find(u => u._id === id) || null;
        const result = attachMethods(user);
        const obj = {
            select: function() { return obj; },
            then: (resolve, reject) => Promise.resolve(result).then(resolve, reject),
            catch: (reject) => Promise.resolve(result).catch(reject)
        };
        return obj;
    },

    findByIdAndUpdate: async (id, data) => {
        const index = users.findIndex(u => u._id === id);
        if (index === -1) return null;
        users[index] = { ...users[index], ...data };
        return attachMethods(users[index]);
    }
};

const Portfolio = {
    find: function(query) {
        let results = portfolio.filter(p => !query || !query.user || p.user === query.user);
        return {
            populate: () => results,
            then: (resolve) => resolve(results)
        };
    },
    findById: async (id) => {
        const asset = portfolio.find(p => p._id === id);
        if (!asset) return null;
        return {
            ...asset,
            user: { toString: () => asset.user },
            deleteOne: async function() {
                portfolio = portfolio.filter(p => p._id !== id);
            }
        };
    },
    create: async (data) => {
        const newAsset = { ...data, _id: Date.now().toString(), createdAt: new Date() };
        portfolio.push(newAsset);
        return newAsset;
    },
    findByIdAndUpdate: async (id, data) => {
        const index = portfolio.findIndex(p => p._id === id);
        if (index === -1) return null;
        portfolio[index] = { ...portfolio[index], ...data };
        return portfolio[index];
    }
};

module.exports = { User, Portfolio };

const prisma = require('../config/prisma');

const createLog = async (logData) => {
    const { userId, action, details } = logData;
    return await prisma.activityLog.create({
        data: { userId, action, details }
    });
};

const getAllLogs = async (query = {}) => {
    const { userId, action, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const where = {};
    if (userId) where.userId = userId;
    if (action) where.action = action;

    return await prisma.activityLog.findMany({
        where,
        skip: parseInt(skip),
        take: parseInt(limit),
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { fullName: true, email: true } } }
    });
};

const getLogById = async (id) => {
    return await prisma.activityLog.findUnique({
        where: { id },
        include: { user: true }
    });
};

module.exports = {
    createLog,
    getAllLogs,
    getLogById
};

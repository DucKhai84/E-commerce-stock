const activityLogService = require('../services/activityLogService');

const getAllLogs = async (req, res) => {
    try {
        const { userId, action, page, limit } = req.query;
        const logs = await activityLogService.getAllLogs({ userId, action, page, limit });
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getLogById = async (req, res) => {
    try {
        const log = await activityLogService.getLogById(req.params.id);
        if (!log) return res.status(404).json({ message: 'Log not found' });
        res.status(200).json(log);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLog = async (req, res) => {
    try {
        await activityLogService.deleteLog(req.params.id);
        res.status(200).json({ message: 'Log entry deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const clearLogs = async (req, res) => {
    try {
        await activityLogService.clearLogs();
        res.status(200).json({ message: 'All logs cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllLogs,
    getLogById,
    deleteLog,
    clearLogs
};

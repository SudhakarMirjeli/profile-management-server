const UserService = require('../services/user.service')
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

async function getUserProfile(req, res) {
    try {
        let response;
        if (req.params.userId) {
            response = await UserService.getUserProfile(req.params.userId);
        } else
            response = await UserService.getUserProfiles();
        if (!response) {
            return res.status(404).json({
                status: false,
                message: 'User not found.'
            });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}


async function addUserProfile(req, res) {
    try {
        console.log("Received Body:", req.body);
        console.log("Received File:", req.file);

        const response = await UserService.addUserProfile(req.body, req.file);
        return res.status(201).json(response);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}

async function updateUserProfile(req, res) {
    try {
        console.log("Received Body in update:", req.body);
        console.log("Received File: in update", req.file);

        const response = await UserService.updateUserProfile(req.params.userId, req.body, req.file);
        if (!response) {
            return res.status(404).json({
                status: false,
                message: 'User not found.'
            });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}


async function removeUserProfile(req, res) {
    try {
        const response = await UserService.deleteUserProfile(req.params.userId);
        if (!response) {
            return res.status(404).json({
                status: false,
                message: 'User not found.'
            });
        }
        return res.status(200).json(response);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ status: false, message: "Internal Server Error" });
    }
}


module.exports = {
    getUserProfile,
    addUserProfile,
    updateUserProfile,
    removeUserProfile,
    upload
}
const UserModel = require('../models/user.model')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY
    }
})


async function getUserProfile(userId) {
    try {
        console.log("Fetching profile for userId:", userId);

        // Fetch user profile
        const userProfile = await UserModel.findById(userId);

        if (userProfile)
            return {
                status: true,
                message: 'User profile retrieved successfully.',
                data: userProfile
            };
    } catch (error) {
        console.error("Error fetching user profile:", error);

        return {
            status: false,
            message: 'Internal Server Error',
            data: null
        };
    }
}
async function getUserProfiles() {
    try {

        // Fetch user profile
        const userProfiles = await UserModel.find();

        if (userProfiles)
            return {
                status: true,
                message: 'User profiles retrieved successfully.',
                data: userProfiles
            };
    } catch (error) {
        console.error("Error fetching user profile:", error);

        return {
            status: false,
            message: 'Internal Server Error',
            data: null
        };
    }
}


async function addUserProfile(userRQ, file) {
    try {
        let profilePictureUrl = null
        if (file)
            profilePictureUrl = await uploadFileToS3(file);
        const userProfile = new UserModel({
            name: userRQ.name,
            email: userRQ.email,
            address: userRQ.address,
            profilePictureUrl: profilePictureUrl?.fileUrl || ""
        })
        const user = await userProfile.save()
        return {
            status: true,
            message: 'User profile added successfully.',
            data: user
        }

    } catch (error) {
        console.log("Error,", error)
        return {
            status: false,
            message: 'Internal Server Error',
            data: null
        };

    }
}

async function updateUserProfile(userId, updateData, file) {
    try {
        console.log("in update service", updateData)
        let profilePictureUrl = null
        if (file) {
            profilePictureUrl = await uploadFileToS3(file);
            updateData['profilePictureUrl'] = profilePictureUrl?.fileUrl || ""
        }
        const updatedUser = await UserModel.findByIdAndUpdate(userId, updateData, { new: true });
        if (updatedUser)
            return {
                status: true,
                message: 'User profile updated successfully.',
                data: updatedUser
            };
    } catch (error) {
        console.error("Error updating user profile:", error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
}

async function deleteUserProfile(userId) {
    try {
        const deletedUser = await UserModel.findByIdAndDelete(userId)

        if (deletedUser)
            return {
                status: true,
                message: 'User profile deleted successfully.'
            }
    } catch (error) {
        console.error("Error deleting user profile:", error);
        return res.status(500).json({
            status: false,
            message: 'Internal Server Error'
        });
    }
}

async function uploadProfilePicture(file) {
    try {


        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: `${Date.now()}_${file.originalname}`,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: 'public-read'
        };
        console.log("1033333", params)
        const uploadResult = await s3Client.upload(params).promise();
        console.log("1055 in aws", uploadResult)
        return uploadResult.Location; // S3 URL of the uploaded image
    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw new Error("Failed to upload image");
    }
}

async function uploadFileToS3(file) {
    try {
        const fileName = `${Date.now()}_${file.originalname}`;
        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read"
        };

        console.log("Uploading file to S3 with params:");

        // Upload File using PutObjectCommand
        await s3Client.send(new PutObjectCommand(params));

        // Construct Public URL
        const fileUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

        return {
            status: true,
            message: "File uploaded successfully",
            fileUrl
        };

    } catch (error) {
        console.error("S3 Upload Error:", error);
        throw new Error("File upload failed");
    }
}


module.exports = {
    getUserProfile,
    addUserProfile,
    updateUserProfile,
    deleteUserProfile,
    uploadProfilePicture,
    getUserProfiles
}
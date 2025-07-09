import { Users } from "../data-models/User.js";
import connect_to_DB from "../bd-connection/connect_to_DB.js";
export default async function getSmartUsers() {
    await connect_to_DB()
    try {
        const sortedUsers = await Users.aggregate([
            {
                $addFields: {
                    arrayLength: { $size: "$tasks" }
                }
            },
            { $sort: { arrayLength: 1 } },
            {
                $project: {
                    name: 1, 
                    _id: 0  
                }
            }

        ]);

        return { success: true, users: sortedUsers };
    } catch (err) {
        return { success: false, message: err.message };
    }


}
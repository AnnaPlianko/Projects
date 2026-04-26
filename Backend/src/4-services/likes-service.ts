import { dal } from "../2-utils/dal";
import { LikeModel } from "../3-models/likes-model";

// Handles like/unlike persistence logic.
class LikesService {

    // Inserts a like and ignores duplicates to keep operation idempotent.
    public async addLike(userId: number, vacationId: number): Promise<LikeModel> {
        const sql = "insert into likes (userId, vacationId) values (?, ?)";
        const values = [userId, vacationId];
        try {
            await dal.execute(sql, values);
        } catch (err: any) {
            if (err?.code !== "ER_DUP_ENTRY") throw err;
        }

        const like = new LikeModel();
        like.userId = userId;
        like.vacationId = vacationId;

        return like;
    }

    // Removes a like relation for the given user and vacation.
    public async removeLike(userId: number, vacationId: number): Promise<void> {
        const sql = "delete from likes where userId = ? and vacationId = ?";
        const values = [userId, vacationId];
        await dal.execute(sql, values);
    }
}

export const likesService = new LikesService();
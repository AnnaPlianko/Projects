import { fileSaver } from "uploaded-file-saver";
import { dal } from "../2-utils/dal";
import { ResourceNotFoundError } from "../3-models/errors";
import { VacationModel } from "../3-models/vacation-model";
import { OkPacketParams } from "mysql2";
import { appConfig } from "../2-utils/app-config";

// Business logic for vacation CRUD and reporting operations.
class VacationsService {

    // Returns all vacations with like counters and user-specific like flag.
    public async getAllVacations(userId: number): Promise<VacationModel[]> {
        const sql = `
            select
                v.*, 
                concat(?, v.image) as imageUrl,
                count(l.vacationId) as likesCount,
                max(case when l.userId = ? then 1 else 0 end) as isLiked
            from \`vacations-list\` as v
            left join likes as l
                on v.id = l.vacationId
            group by v.id
            order by v.startDate asc
        `;
        const values = [appConfig.imageLocation, userId];
        const vacations = await dal.execute(sql, values) as any[];
        return vacations.map(v => ({ ...v, isLiked: Boolean(v.isLiked) })) as VacationModel[];
    }

    // Returns one vacation by id, including full image URL.
    public async getOneVacation(id: number): Promise<VacationModel> {
        const sql = "select *, concat(?, image) as imageUrl from `vacations-list` where id = ?";
        const values = [appConfig.imageLocation, id];
        const vacations = await dal.execute(sql, values) as VacationModel[];
        const vacation = vacations[0];
        if (!vacation) throw new ResourceNotFoundError(id);
        return vacation;
    }

    // Validates and creates a new vacation, then reloads it from DB.
    public async addVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validate();
        const image = vacation.image ? await fileSaver.add(vacation.image!) : null;
        const sql = "insert into `vacations-list` (destination, description, startDate, endDate, price, image) values (?, ?, ?, ?, ?, ?)";
        const values = [vacation.destination!, vacation.description!, vacation.startDate!, vacation.endDate!, vacation.price!, image!];
        const info: OkPacketParams = await dal.execute(sql, values) as OkPacketParams;
        const dbVacation = await this.getOneVacation(info.insertId!);
        return dbVacation;
    }

    // Updates vacation fields and optional image replacement.
    public async updateVacation(vacation: VacationModel): Promise<VacationModel> {
        vacation.validate();
        const oldImageName = await this.getImageName(vacation.id!);
        const newImageName = vacation.image ? await fileSaver.update(oldImageName, vacation.image) : oldImageName;
        const sql = "update `vacations-list` set destination=?, description=?, startDate=?, endDate=?, price=?, image=? where id=?";
        const values = [vacation.destination!, vacation.description!, vacation.startDate!, vacation.endDate!, vacation.price!, newImageName, vacation.id!];
        const info: OkPacketParams = await dal.execute(sql, values) as OkPacketParams;
        if (info.affectedRows === 0) throw new ResourceNotFoundError(vacation.id!);
        const dbVacation = await this.getOneVacation(vacation.id!);
        return dbVacation;
    }

    // Deletes vacation and its image file if one exists.
    public async deleteVacation(id: number): Promise<void> {
        const oldImageName = await this.getImageName(id);
        const sql = "delete from `vacations-list` where id = ?";
        const info: OkPacketParams = await dal.execute(sql, [id]) as OkPacketParams;
        if (info.affectedRows === 0) throw new ResourceNotFoundError(id);
        if (oldImageName) await fileSaver.delete(oldImageName);
    }

    // Builds CSV text used by admin download endpoint.
    public async getVacationsCSV(): Promise<string> {
        const sql = `
            select v.destination, count(l.vacationId) as likesCount
            from \`vacations-list\` v
            left join likes l on v.id = l.vacationId
            group by v.id, v.destination
            order by v.destination
        `;
        const rows = await dal.execute(sql, []) as any[];
        const lines = ["destination,likesCount", ...rows.map((r: any) => `"${r.destination}",${r.likesCount}`)];
        return lines.join("\n");
    }

    // Returns destination/likes tuples for admin report chart.
    public async getVacationsForReport(): Promise<any[]> {
        const sql = `
            select v.destination, count(l.vacationId) as likesCount
            from \`vacations-list\` v
            left join likes l on v.id = l.vacationId
            group by v.id, v.destination
            order by likesCount desc
        `;
        return await dal.execute(sql, []) as any[];
    }

    // Reads current image filename by vacation id.
    private async getImageName(id: number): Promise<string> {
        const sql = "select image from `vacations-list` where id = ?";
        const vacations = await dal.execute(sql, [id]) as any[];
        return vacations[0]?.image || "";
    }
}

export const vacationsService = new VacationsService();

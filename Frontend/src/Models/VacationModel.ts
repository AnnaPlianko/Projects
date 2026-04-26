// Frontend representation of vacation entity returned by API.
export class VacationModel {
    public id?: number;
    public destination?: string;
    public description?: string;
    public startDate?: string;
    public endDate?: string;
    public price?: number;
    public image?: FileList;
    public imageUrl?: string;
    public likesCount?: number;
    public isLiked?: boolean;
}

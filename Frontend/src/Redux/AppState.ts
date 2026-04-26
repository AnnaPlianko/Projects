import { UserModel } from "../Models/UserModel";
import { VacationModel } from "../Models/VacationModel";

// Root Redux state shape used by selectors.
export type AppState = {
    user: UserModel | null;
    vacations: VacationModel[];
}
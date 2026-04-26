import mysql2, { PoolOptions, QueryError, QueryResult, SqlValue } from "mysql2";
import { appConfig } from "./app-config";

// DAL = Data Access Layer.
class DAL {

    // Database properties: 
    private readonly options: PoolOptions = {
        host: appConfig.mysqlHost, // The computer name or IP address where the database is hosted. "localhost" = "127.0.0.1" = current computer.
        user: appConfig.mysqlUser, // Database user.
        password: appConfig.mysqlPassword, // Database password.
        database: appConfig.mysqlDatabase // Database name.
    };

    // Database connection:
    private connection = mysql2.createPool(this.options);

    // Executes parameterized SQL and returns typed query results.
    public execute(sql: string, values?: (number | string | Date| SqlValue |File)[]): Promise<QueryResult> {
        return new Promise<QueryResult>((resolve, reject) => {
            this.connection.query(sql, values, (err: QueryError | null, result: QueryResult) => {

                // If error: 
                if(err) {
                    reject(err);
                    return;
                }
                
                // All is good:
                resolve(result);

            });
        });
    }

}

export const dal = new DAL();

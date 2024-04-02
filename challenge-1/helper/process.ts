import * as fs from "fs";
import * as fastcsv from "fast-csv";
import knex from "knex";
import tableCreate from "./tableCreate";
import { SQLITE_DB_PATH } from "../resources";

/* 
    this function is called to process the downloaded csv and insert it into a table in the database
    inputs:
        filePath - the location of your csv
        tableName - Name of the table to insert into
*/
export default async function processCSV(
  filePath: string,
  tableName: string
): Promise<void> {
  // return a promise to handle asyunchronus behaviour
  return new Promise<void>(async (resolve, reject) => {
    // creating 'out' folder
    fs.mkdirSync("out", { recursive: true }); // Ensure 'out' directory exists

    // knex instance for sqllite3
    const knexInstance = knex({
      client: "sqlite3",
      connection: {
        filename: SQLITE_DB_PATH,
      },
      useNullAsDefault: true,
    });

    // creation of tables based on the table name
    await tableCreate(knexInstance, tableName);
    //batch size
    const batchInsertSize = 100;
    //Buffer to store batches
    try {
      let data: any[] = [];
      //creating a stream for inputing csv
      const stream = fs
        .createReadStream(filePath)
        .pipe(fastcsv.parse({ headers: true }));

      // Prints the Starting time of the task
      console.log("Start time : ", new Date().getTime());
      for await (const row of stream) {
        data.push(row);

        // Insert data into the database in batches
        if (data.length >= batchInsertSize) {
          await knexInstance.transaction(async (trx) => {
            await trx.batchInsert(tableName, data);
          });

          // Clear the data array
          data = [];
        }
      }

      // Insert any remaining rows
      if (data.length > 0) {
        await knexInstance.transaction(async (trx) => {
          await trx.batchInsert(tableName, data);
        });
      }

      //deallocate knex instance
      await knexInstance.destroy();

      // Prints the Completion time of the task
      console.log("Completion time : ", new Date().getTime());
      resolve();
    } catch (err) {
      console.log(err);
      //remove the knex connection to sqllite
      await knexInstance.destroy();
      reject(err);
    }
  });
}

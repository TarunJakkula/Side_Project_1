export default async function tableCreate(
  knexInstance: any,
  tableName: string
): Promise<void> {
  return new Promise<void>(async (resolve, reject) => {
    try {
      // knex schema used to create table
      await knexInstance.schema.createTable(tableName, (table: any) => {
        // check the table name and creates table accordingly
        if (tableName === "organizations") {
          table.increments("Index").primary(); // primary key
          table.string("Organization Id").notNullable();
          table.string("Name").notNullable();
          table.string("Website").notNullable();
          table.string("Country").notNullable();
          table.string("Description").notNullable();
          table.bigInteger("Founded").notNullable();
          table.string("Industry").notNullable();
          table.bigInteger("Number of employees").notNullable();
        } else if (tableName === "customers") {
          table.increments("Index").primary(); // primary key
          table.string("Customer Id").notNullable();
          table.string("First Name").notNullable();
          table.string("Last Name").notNullable();
          table.string("Company").notNullable();
          table.string("City").notNullable();
          table.string("Country").notNullable();
          table.string("Phone 1").notNullable();
          table.string("Phone 2").notNullable();
          table.string("Email").notNullable();
          table.string("Subscription Date").notNullable();
          table.string("Website").notNullable();
        }
      });
      resolve();
    } catch (err) {
      console.log("Err:", err);
      reject(err);
    }
  });
}

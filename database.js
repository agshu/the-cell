import mysql from "mysql2";

const db = mysql
  .createConnection({
    user: process.env.USER,
    host: process.env.HOST, //gör till process.env senare för säkerhet
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
  })
  .promise();

export async function getUsers() {
  const [users] = await db.query("SELECT * FROM user_data");
  return users;
}

export async function getUser(id) {
  const [user] = await db.query(`SELECT * FROM user_data WHERE id = ?`, [id]); // prepared statement för säkerhet
  return user;
}

export async function createUser(name) {
  const [createdUser] = await db.query(
    `INSERT INTO user_data (name) VALUES (?)`,
    [name]
  );
  return createdUser;
}

async function main() {
  const myUsers = await getUsers();
  // createUser("David");
  console.log(myUsers);
}

main();

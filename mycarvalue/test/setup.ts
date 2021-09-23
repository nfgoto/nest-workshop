import { rm } from "fs/promises";
import { join } from "path";
import { getConnection } from "typeorm";

/**
 * delete sqlite db file before each test
 */
global.beforeEach(async () => {
  try {
    await rm(join(__dirname, '..', 'test.sqlite'));
  } catch { }
});

/**
 * close db connection after each test
 * to kill connection to sqlite file that will be deleted in beforeEach
 * and force typeorm to create a new connection (new sqlite file)
 */
global.afterEach(async () => {
  const conn = getConnection();
  await conn.close();
})
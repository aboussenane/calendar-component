const db = require('./schema');

async function initDatabase() {
  await db.schema
    .createTable('users')
    .addColumn('userId', 'serial', (col) => col.primaryKey())
    .addColumn('username', 'varchar(255)', (col) => col.notNull())
    .addColumn('password', 'varchar(255)', (col) => col.notNull())
    .execute();

  await db.schema
    .createTable('bookings')
    .addColumn('bookingId', 'serial', (col) => col.primaryKey())
    .addColumn('userId', 'integer', (col) =>
      col.references('users.userId').notNull()
    )
    .addColumn('type', 'varchar(255)', (col) => col.notNull())
    .addColumn('startDate', 'timestamp', (col) => col.notNull())
    .addColumn('endDate', 'timestamp', (col) => col.notNull())
    .execute();
}

initDatabase()
  .then(() => {
    console.log('Database initialized');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error initializing database', err);
    process.exit(1);
  });
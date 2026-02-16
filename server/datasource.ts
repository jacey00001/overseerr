import path from 'path';
import 'reflect-metadata';
import type { DataSourceOptions, EntityTarget, Repository } from 'typeorm';
import { DataSource } from 'typeorm';

const fromServerRoot = (...parts: string[]) =>
  path.join(process.cwd(), 'server', ...parts);
const fromDistRoot = (...parts: string[]) =>
  path.join(process.cwd(), 'dist', ...parts);

const devConfig: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.CONFIG_DIRECTORY
    ? `${process.env.CONFIG_DIRECTORY}/db/db.sqlite3`
    : 'config/db/db.sqlite3',
  synchronize: true,
  migrationsRun: false,
  logging: false,
  enableWAL: true,

  // IMPORTANT: use **/*.ts (not *.ts) so nested files are found
  // and keep {ts,js} to work with different dev runtimes.
  entities: [fromServerRoot('entity', '**', '*.{ts,js}')],
  migrations: [fromServerRoot('migration', '**', '*.{ts,js}')],
  subscribers: [fromServerRoot('subscriber', '**', '*.{ts,js}')],
};

const prodConfig: DataSourceOptions = {
  type: 'sqlite',
  database: process.env.CONFIG_DIRECTORY
    ? `${process.env.CONFIG_DIRECTORY}/db/db.sqlite3`
    : 'config/db/db.sqlite3',
  synchronize: false,
  migrationsRun: false,
  logging: false,
  enableWAL: true,

  entities: [fromDistRoot('entity', '**', '*.js')],
  migrations: [fromDistRoot('migration', '**', '*.js')],
  subscribers: [fromDistRoot('subscriber', '**', '*.js')],
};

const dataSource = new DataSource(
  process.env.NODE_ENV !== 'production' ? devConfig : prodConfig
);

export const getRepository = <Entity extends object>(
  target: EntityTarget<Entity>
): Repository<Entity> => {
  return dataSource.getRepository(target);
};

export default dataSource;

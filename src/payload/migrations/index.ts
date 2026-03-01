import * as migration_20250406_015453 from './20250406_015453';
import * as migration_20250429_224301 from './20250429_224301';
import * as migration_20250727_204855 from './20250727_204855';
import * as migration_20251101_180526 from './20251101_180526';
import * as migration_20251116_213520 from './20251116_213520';
import * as migration_20260225_174551_blocks_as_json from './20260225_174551_blocks_as_json';

export const migrations = [
  {
    up: migration_20250406_015453.up,
    down: migration_20250406_015453.down,
    name: '20250406_015453',
  },
  {
    up: migration_20250429_224301.up,
    down: migration_20250429_224301.down,
    name: '20250429_224301',
  },
  {
    up: migration_20250727_204855.up,
    down: migration_20250727_204855.down,
    name: '20250727_204855',
  },
  {
    up: migration_20251101_180526.up,
    down: migration_20251101_180526.down,
    name: '20251101_180526',
  },
  {
    up: migration_20251116_213520.up,
    down: migration_20251116_213520.down,
    name: '20251116_213520',
  },
  {
    up: migration_20260225_174551_blocks_as_json.up,
    down: migration_20260225_174551_blocks_as_json.down,
    name: '20260225_174551_blocks_as_json'
  },
];

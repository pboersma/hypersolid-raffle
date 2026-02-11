import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from '@database/database.module';
import { databaseProviders } from '@database/database.provider';

describe('DatabaseModule', () => {
  it('should compile the module', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    expect(module).toBeDefined();
  });

  it('should export DATABASE_PROVIDER', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();

    const provider = module.get('DATA_SOURCE');
    expect(provider).toBeDefined();
  });
});

describe('databaseProviders', () => {
  it('should be an array of providers', () => {
    expect(Array.isArray(databaseProviders)).toBe(true);
    expect(databaseProviders).toHaveLength(1);
  });

  it('should have DATA_SOURCE provider', () => {
    const dataSourceProvider = databaseProviders[0];
    expect(dataSourceProvider.provide).toBe('DATA_SOURCE');
    expect(typeof dataSourceProvider.useFactory).toBe('function');
  });
});

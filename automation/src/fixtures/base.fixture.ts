import { test as base, expect } from '@playwright/test';
import { PageObjectManager } from '@/pom/PageObjectManager';
import { UserApiClient } from '@/utils/api/UserApiClient';
import { config } from '@/config/env.config';

type TestFixtures = {
  pom: PageObjectManager;
  userApi: UserApiClient;
};

export const test = base.extend<TestFixtures>({
  pom: async ({ page }, use) => {
    await use(new PageObjectManager(page));
  },
  userApi: async ({ request }, use) => {
    await use(new UserApiClient(request, config.apiBaseUrl, config.apiToken));
  },
});

export { expect };

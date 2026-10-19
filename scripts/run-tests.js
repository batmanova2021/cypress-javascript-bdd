const cypress = require('cypress');
const suite = process.argv[2] || 'regression';
const browser = process.argv[3] || 'chrome';
if (!['smoke', 'regression'].includes(suite))
  throw new Error(`Unknown suite: ${suite}`);
const record =
  process.env.CYPRESS_CLOUD_RECORD === 'true' &&
  Boolean(process.env.CYPRESS_PROJECT_ID && process.env.CYPRESS_RECORD_KEY);
cypress
  .run({
    browser,
    expose: { tags: `@${suite}` },
    record,
    ...(record && process.env.GITHUB_ACTIONS === 'true'
      ? { group: `${suite}-${browser}` }
      : {}),
  })
  .then((result) => {
    if (result.failures || !result.totalTests) {
      console.error(result.message || 'No tests executed.');
      process.exitCode = 1;
    } else {
      process.exitCode = result.totalFailed ? 1 : 0;
    }
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

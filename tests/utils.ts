export { testError };

async function testError(callback: () => Promise<void> | void): Promise<Error> {
  let error: unknown;
  try {
    await callback();
  } catch (e: unknown) {
    error = e;
  }
  return error as Error;
}

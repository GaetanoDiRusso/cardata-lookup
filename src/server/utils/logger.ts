const log = {
  info: (message: string) => {
    // eslint-disable-next-line no-console
    console.log(`[INFO] ${message}`);
  },
  error: (message: string, error: any) => {
    if (error instanceof Error) {
      // eslint-disable-next-line no-console
      console.log(`[ERROR] ${message} - ${error.message}`);
    } else if (typeof error === 'string') {
      // eslint-disable-next-line no-console
      console.log(`[ERROR] ${message} - ${error}`);
    } else {
      // eslint-disable-next-line no-console
      console.log(`[ERROR] ${message} - ${JSON.stringify(error)}`);
    }
  },
  accountEvent: (message: string) => {
    console.log(`[ACCOUNT_EVENT] ${message}`);
  },
};

export default log

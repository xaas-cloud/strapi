import { cloudApiFactory, tokenServiceFactory } from '../services';
import { createLogger } from '../services/logger';

interface CreateGrowthSsoFreeTrialInput {  
  strapiVersion: string | undefined;
}

interface CreateGrowthSsoFreeTrialResponse {
  license: string;
}

export default async ({
  strapiVersion,
}: CreateGrowthSsoFreeTrialInput): Promise<CreateGrowthSsoFreeTrialResponse | undefined> => {
  const logger = createLogger();
  const { retrieveToken } = await tokenServiceFactory({ logger });

  const token = await retrieveToken();
  if (!token) {
    return;
  }

  const cloudApiService = await cloudApiFactory({ logger }, token);

  try {
    const response = await cloudApiService.createFreeTrial({ strapiVersion: strapiVersion || '' });
    return { license: response.data?.licenseKey };
  } catch (e: Error | unknown) {
    logger.debug(e);
    logger.error(
      'We encountered an issue while creating your free trial. Please try again in a moment. If the problem persists, contact support for assistance.'
    );
  }
};

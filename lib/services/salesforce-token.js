import prisma from '../prisma/client';

export default class SalesforceTokenService {
  static async saveTokens(userId, tokenData) {
    const { access_token, refresh_token, instance_url, expires_in } = tokenData;

    let expiresAt;

    if (expires_in && !isNaN(parseInt(expires_in))) {
      expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + parseInt(expires_in));
    } else {
      expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 2);
    }

    console.log('Token Data:', {
      userId,
      accessToken: access_token ? 'present' : 'missing',
      refreshToken: refresh_token ? 'present' : 'missing',
      instanceUrl: instance_url,
      expiresIn: expires_in,
      calculatedExpiresAt: expiresAt,
    });

    return prisma.salesforceToken.upsert({
      where: { userId },
      update: {
        accessToken: access_token,
        refreshToken: refresh_token,
        instanceUrl: instance_url,
        expiresAt,
      },
      create: {
        userId,
        accessToken: access_token,
        refreshToken: refresh_token,
        instanceUrl: instance_url,
        expiresAt,
      },
    });
  }

  static async getTokens(userId) {
    return prisma.salesforceToken.findUnique({
      where: { userId },
    });
  }

  static isTokenExpired(expiresAt) {
    const now = new Date();

    now.setMinutes(now.getMinutes() + 5);
    return now >= new Date(expiresAt);
  }
}

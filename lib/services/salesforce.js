import axios from 'axios';

class SalesforceAuthService {
  constructor() {
    this.clientId = process.env.SALESFORCE_CLIENT_ID;
    this.clientSecret = process.env.SALESFORCE_CLIENT_SECRET;
    this.loginUrl = process.env.SALESFORCE_LOGIN_URL;

    console.log('SALESFORCE_CLIENT_ID:', this.clientId);
    console.log('SALESFORCE_CLIENT_SECRET:', this.clientSecret);
    console.log('SALESFORCE_LOGIN_URL:', this.loginUrl);

    this.redirectUri =
      process.env.NODE_ENV === 'production'
        ? 'https://qiz-beta.vercel.app/api/auth/callback/salesforce'
        : `http://localhost:3000/api/auth/callback/salesforce`;

    this.tokenUrl = `${this.loginUrl}/services/oauth2/token`;
  }

  getAuthorizationUrl(returnTo = null) {
    const stateBase =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const state = returnTo
      ? `${stateBase}|${Buffer.from(returnTo).toString('base64')}`
      : stateBase;

    return (
      `${this.loginUrl}/services/oauth2/authorize?` +
      `client_id=${encodeURIComponent(this.clientId)}` +
      `&redirect_uri=${encodeURIComponent(this.redirectUri)}` +
      `&response_type=code` +
      `&state=${encodeURIComponent(state)}`
    );
  }

  async getTokenFromCode(code) {
    try {
      const response = await axios.post(this.tokenUrl, null, {
        params: {
          grant_type: 'authorization_code',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          redirect_uri: this.redirectUri,
          code: code,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      console.log(
        'Salesforce token response structure:',
        Object.keys(response.data).join(', ')
      );

      if (response.data.expires_in) {
        response.data.expires_in = parseInt(response.data.expires_in);
      } else {
        response.data.expires_in = 7200;
      }

      return response.data;
    } catch (error) {
      console.error(
        'Error exchanging code for token:',
        error.response?.data || error.message
      );

      if (error.response?.data?.error === 'invalid_grant') {
        throw new Error('Authorization code has expired. Please try again.');
      }

      throw new Error(
        'Failed to authenticate with Salesforce: ' +
          (error.response?.data?.error_description || error.message)
      );
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await axios.post(this.tokenUrl, null, {
        params: {
          grant_type: 'refresh_token',
          client_id: this.clientId,
          client_secret: this.clientSecret,
          refresh_token: refreshToken,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      return response.data;
    } catch (error) {
      console.error(
        'Error refreshing token:',
        error.response?.data || error.message
      );
      throw new Error('Failed to refresh Salesforce token');
    }
  }

  _generateState() {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  extractReturnPath(state) {
    if (!state || !state.includes('|')) {
      return null;
    }

    const [_, encodedPath] = state.split('|');
    try {
      return Buffer.from(encodedPath, 'base64').toString();
    } catch (e) {
      console.error('Failed to decode return path from state:', e);
      return null;
    }
  }
}

const salesforceAuthService = new SalesforceAuthService();
export default salesforceAuthService;

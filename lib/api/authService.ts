import api from "./axios";

export type UserRole = "user" | "admin" | "teacher";

export type Token = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type AuthLoginResponse = Token & {
  redirect_to: string;
};

export type GoogleLoginPayload = {
  id_token: string;
};

export type TelegramLoginPayload = {
  id: number;
  first_name: string;
  last_name?: string | null;
  username?: string | null;
  photo_url?: string | null;
  auth_date: number;
  hash: string;
};

export type SendOtpPayload = {
  phone: string;
  purpose?: "login" | "register" | "reset_password" | "link_contact";
  channel?: "sms" | "telegram" | "email";
};

export type StatusResponse = {
  status: string;
  message?: string | null;
};

export type BotSendOtpResponse = {
  status: string;
  code?: string;
  message?: string;
};

export type PhoneLoginPayload = {
  phone: string;
  code: string;
};

export type PhoneRegisterPayload = {
  phone: string;
  full_name?: string;
};

export type PhoneLoginResponse = {
  status: "success" | "need_registration";
  token?: Token;
  redirect_to?: string | null;
  message?: string | null;
};

export type RefreshTokenPayload = {
  refresh_token: string;
};

export type UserProfile = {
  full_name?: string | null;
  username?: string | null;
  avatar_url?: string | null;
  bio?: string | null;
  birth_date?: string | null;
  language?: string | null;
  timezone?: string | null;
  created_at: string;
  updated_at: string;
};

export type UserContact = {
  id: number;
  contact_type: "email" | "phone" | "telegram";
  value: string;
  normalized_value: string;
  is_verified: boolean;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
};

export type UserIdentity = {
  id: number;
  provider: "google" | "telegram" | "phone";
  provider_id: string;
  created_at: string;
  updated_at: string;
};

export type UserMeResponse = {
  id: number;
  is_active: boolean;
  global_role: UserRole;
  created_at: string;
  updated_at: string;
  profile?: UserProfile | null;
  contacts: UserContact[];
  identities: UserIdentity[];
};

export type DashboardRedirectResponse = {
  role: UserRole;
  redirect_to: string;
};

export type SessionResponse = {
  id: string;
  user_id: number;
  session_family_id: string;
  replaced_by_session_id?: string | null;
  user_agent?: string | null;
  ip_address?: string | null;
  device_name?: string | null;
  client_name?: string | null;
  expires_at: string;
  last_seen_at?: string | null;
  is_revoked: boolean;
  revoked_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type ExchangeTokenPayload = {
  code: string;
  client_id: string;
  redirect_uri: string;
};

export type AuthorizeParams = {
  client_id: string;
  redirect_uri: string;
  state: string;
};

export type AuthorizeRedirectResponse = {
  redirect_to: string;
};

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const LOGIN_AT_KEY = "login_at";

const AUTH_BASE = "/api/v1/auth";

function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

function saveTokens(data: Token): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, data.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh_token);
  localStorage.setItem(LOGIN_AT_KEY, Date.now().toString());
}

function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(LOGIN_AT_KEY);
}

function redirectTo(url?: string | null): void {
  if (!url) return;
  window.location.href = url;
}

export const authService = {
  getAccessToken,
  getRefreshToken,
  saveTokens,
  clearTokens,

  googleLogin: async (
    payload: GoogleLoginPayload,
  ): Promise<AuthLoginResponse> => {
    const response = await api.post<AuthLoginResponse>(
      `${AUTH_BASE}/google`,
      payload,
    );

    if (response.data.access_token) {
      saveTokens(response.data);
    }

    return response.data;
  },

  telegramLogin: async (
    payload: TelegramLoginPayload,
  ): Promise<AuthLoginResponse> => {
    const response = await api.post<AuthLoginResponse>(
      `${AUTH_BASE}/telegram`,
      payload,
    );

    if (response.data.access_token) {
      saveTokens(response.data);
    }

    return response.data;
  },

  sendOtp: async (payload: SendOtpPayload): Promise<StatusResponse> => {
    const response = await api.post<StatusResponse>(
      `${AUTH_BASE}/send-otp`,
      payload,
    );
    return response.data;
  },

  sendOtpBot: async (payload: SendOtpPayload): Promise<BotSendOtpResponse> => {
    const response = await api.post<BotSendOtpResponse>(
      `${AUTH_BASE}/bot/send-otp`,
      payload,
    );
    return response.data;
  },

  loginByPhone: async (
    payload: PhoneLoginPayload,
  ): Promise<PhoneLoginResponse> => {
    const response = await api.post<PhoneLoginResponse>(
      `${AUTH_BASE}/login/phone`,
      payload,
    );

    if (response.data.token?.access_token) {
      saveTokens(response.data.token);
    }

    return response.data;
  },

  registerByPhone: async (
    payload: PhoneRegisterPayload,
  ): Promise<AuthLoginResponse> => {
    const response = await api.post<AuthLoginResponse>(
      `${AUTH_BASE}/register/phone`,
      payload,
    );

    if (response.data.access_token) {
      saveTokens(response.data);
    }

    return response.data;
  },

  refresh: async (): Promise<Token | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const response = await api.post<Token>(`${AUTH_BASE}/refresh`, {
      refresh_token: refreshToken,
    });

    if (response.data.access_token) {
      saveTokens(response.data);
    }

    return response.data;
  },

  getMe: async (): Promise<UserMeResponse> => {
    const response = await api.get<UserMeResponse>(`${AUTH_BASE}/me`);
    return response.data;
  },

  getDashboardRedirect: async (): Promise<DashboardRedirectResponse> => {
    const response = await api.get<DashboardRedirectResponse>(
      `${AUTH_BASE}/dashboard-redirect`,
    );
    return response.data;
  },

  getSessions: async (): Promise<SessionResponse[]> => {
    const response = await api.get<SessionResponse[]>(`${AUTH_BASE}/sessions`);
    return response.data;
  },

  revokeSession: async (sessionId: string): Promise<StatusResponse> => {
    const response = await api.delete<StatusResponse>(
      `${AUTH_BASE}/sessions/${sessionId}`,
    );
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post<StatusResponse>(`${AUTH_BASE}/logout`);
    } finally {
      clearTokens();
      window.location.href = "https://auth.enwis.uz";
    }
  },

  logoutByRefreshToken: async (): Promise<StatusResponse | null> => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return null;

    const response = await api.post<StatusResponse>(
      `${AUTH_BASE}/logout/token`,
      {
        refresh_token: refreshToken,
      },
    );

    clearTokens();
    return response.data;
  },

  logoutAll: async (): Promise<StatusResponse> => {
    const response = await api.post<StatusResponse>(`${AUTH_BASE}/logout-all`);
    clearTokens();
    return response.data;
  },

  authorize: async (
    params: AuthorizeParams,
  ): Promise<AuthorizeRedirectResponse> => {
    const response = await api.get<AuthorizeRedirectResponse>(
      `${AUTH_BASE}/authorize`,
      {
        params,
      },
    );
    return response.data;
  },

  authorizeRedirect: (params: AuthorizeParams): void => {
    const query = new URLSearchParams({
      client_id: params.client_id,
      redirect_uri: params.redirect_uri,
      state: params.state,
    }).toString();

    const baseURL = api.defaults.baseURL || "";
    window.location.href = `${baseURL}${AUTH_BASE}/authorize/redirect?${query}`;
  },

  exchangeToken: async (payload: ExchangeTokenPayload): Promise<Token> => {
    const response = await api.post<Token>(
      `${AUTH_BASE}/token/exchange`,
      payload,
    );

    if (response.data.access_token) {
      saveTokens(response.data);
    }

    return response.data;
  },

  handleLoginRedirect: (
    response: AuthLoginResponse | PhoneLoginResponse,
  ): void => {
    if ("redirect_to" in response && response.redirect_to) {
      redirectTo(response.redirect_to);
    }
  },
};

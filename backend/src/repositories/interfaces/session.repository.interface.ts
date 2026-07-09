export interface Session {
  token: string;
  createdAt: Date;
}

export interface ISessionRepository {
  create(): Promise<Session>;
  exists(token: string): Promise<boolean>;
  delete(token: string): Promise<void>;
}

export interface ResultModel {
    userResult?: {
        createdTimestamp: string; 
        username: string;
        name: string;
        email: string;
        password: string;
    };
    errorMessage?: string;
  }
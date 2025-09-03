/**
 * Общий тип коллекции с пагинацией
 */
export type TCollection<T> = {
  docs: T[];
  totalDocs: number;
  limit?: number;
  totalPages?: number;
  page?: number;
  pagingCounter?: number;
  hasPrevPage?: boolean;
  hasNextPage?: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export enum EOauthClientType {
  HH = 'hh',
  GOOGLE = 'google',
}

export type TError = Error & { data: { message: string; statusCode: number } };

export interface IBasicRetrospectiveVote<T> {
  uuid: string;
  author: T;
  value: number;
}

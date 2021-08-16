export default interface ReduxAction<T> {
  type: string
  payload: T
};
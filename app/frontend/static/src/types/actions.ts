interface ActionInterface<T> {
  type: string
  payload: T
};


export interface SET_GUEST_CAN_PAUSE
extends ActionInterface<boolean> {
  type: 'SET_GUEST_CAN_PAUSE'
};
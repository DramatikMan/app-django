export interface RoomSettingsInterface {
  guestCanPause: boolean
  votesToSkip: number
};


export interface GlobalStateInterface {
  RoomSettingsPage: RoomSettingsInterface
};
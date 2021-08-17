export interface postRoomResponseData {
    code: string;
  };
  
  
  export interface getRoomResponseData {
    guestCanPause: boolean;
    votesToSkip: number;
    isHost: boolean;
  };
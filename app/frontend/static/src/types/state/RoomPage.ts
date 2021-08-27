export default interface RoomPageState {
  guestCanPause: boolean;
  votesToSkip: number;
  isHost: boolean;
  showSettings: boolean;
  spotifyAuthenticated: boolean;
  song: {
    title: string;
    artist: string;
    duration: number;
    progress: number;
    image_url: string;
    is_playing: boolean;
    votes: number;
    votes_required: number;
    id: string;
  };
};
export const seedData = {
  users: {
    _model: "User",
    homer: {
      firstName: "Homer",
      lastName: "Simpson",
      email: "homer@simpson.com",
      password: "secret",
    },
    marge: {
      firstName: "Marge",
      lastName: "Simpson",
      email: "marge@simpson.com",
      password: "secret",
    },
    bart: {
      firstName: "Bart",
      lastName: "Simpson",
      email: "bart@simpson.com",
      password: "secret",
    },
  },
  playlists: {
    _model: "Playlist",
    mozart: {
      title: "Mozart Favourites",
      userId: "->users.bart",
    },
  },
  tracks: {
    _model: "Track",
    track_1: {
      title: "Violin Concerto No. 1",
      artist: "Mozart",
      duration: 15,
      playlistId: "->playlists.mozart",
    },
    track_2: {
      title: "Violin Concerto No. 5",
      artist: "Mozart",
      duration: 17,
      playlistId: "->playlists.mozart",
    },
  },
};

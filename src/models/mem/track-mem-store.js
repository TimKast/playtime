// eslint-disable-next-line import/no-unresolved
import { v4 } from "uuid";

let tracks = [];

export const trackMemStore = {
  async getAllTracks() {
    return tracks;
  },

  async addTrack(track, playlistId ) {
    track._id = v4();
    track.playlistId = playlistId;
    tracks.push(track);
    return track;
  },

  async getTracksByPlaylist(playlistId) {
    return tracks.filter((track) => track.playlistId === playlistId);
  },

  async getTrackById(id) {
    return tracks.find((track) => track._id === id);
  },

  async deleteTrackById(id) {
    const index = tracks.findIndex((track) => track._id === id);
    tracks.splice(index, 1);
  },

  async deleteAllTracks() {
    tracks = [];
  },
};

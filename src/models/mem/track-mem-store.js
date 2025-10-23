// eslint-disable-next-line import/no-unresolved
import { v4 } from "uuid";

let tracks = [];

export const trackMemStore = {
  async getAllTracks() {
    return tracks;
  },

  async addTrack(playlistId, track) {
    track._id = v4();
    track.playlistId = playlistId;
    tracks.push(track);
    return track;
  },

  async getTracksByPlaylist(playlistId) {
    let foundTracks = tracks.filter((track) => track.playlistId === playlistId);
    if (!foundTracks) {
      foundTracks = null;
    }
    return foundTracks;
  },

  async getTrackById(id) {
    let foundTrack = tracks.find((track) => track._id === id);
    if (!foundTrack) {
      foundTrack = null;
    }
    return foundTrack;
  },

  async deleteTrack(id) {
    const index = tracks.findIndex((track) => track._id === id);
    if (index !== -1) tracks.splice(index, 1);
  },

  async deleteAllTracks() {
    tracks = [];
  },
};

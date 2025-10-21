export const aboutController = {
  index: {
    handler: async function (request, h) {
      return h.view("about-view", { title: "About Playlist" });
    },
  },
};

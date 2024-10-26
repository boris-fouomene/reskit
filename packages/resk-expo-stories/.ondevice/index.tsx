import { Session } from "@resk/expo";
import { view } from "./storybook.requires";

const StorybookUIRoot = view.getStorybookUI({
  storage: {
    getItem: Session.get,
    setItem: Session.set,
  },
});

export default StorybookUIRoot;

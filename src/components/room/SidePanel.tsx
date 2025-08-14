import { button, useControls } from "leva";

export default function SidePanel() {
  const DEFAULT_WIDTH = 5;
  const DEFAULT_HEIGHT = 4;
  const DEFAULT_WALL_COLOR = "#FFFFFF";
  const DEFAULT_FLOOR_COLOR = "#FFFFFF";
  const wallTextures = {
    "Clean Stone":
      "/textures/walls/slightly-blotted-clean-pale-stucco-pattern.jpg",
  };
  const DEFAULT_WALL_TEXTURE = wallTextures["Clean Stone"];
  const floorTextures = {
    "Wooden Floor": "/textures/floors/2145.jpg",
  };
  const DEFAULT_FLOOR_TEXTURE = floorTextures["Wooden Floor"];

  const [{ roomWidth, roomHeight }, setDimensions] = useControls(
    "Room Dimensions",
    () => ({
      roomWidth: {
        value: DEFAULT_WIDTH,
        min: 1,
        max: 20,
        step: 1,
        label: "Width",
      },
      roomHeight: {
        value: DEFAULT_HEIGHT,
        min: 1,
        max: 20,
        step: 1,
        label: "Height",
      },
      "Reset Size": button(() => {
        setDimensions({ roomWidth: DEFAULT_WIDTH, roomHeight: DEFAULT_HEIGHT });
      }),
    })
  );

  const [{ wallColor, floorColor, wallTexture, floorTexture }, setRoomColors] =
    useControls("Room Colors", () => ({
      wallColor: {
        value: DEFAULT_WALL_COLOR,
        label: "Wall Color",
      },
      floorColor: {
        value: DEFAULT_FLOOR_COLOR,
        label: "Floor Color",
      },
      wallTexture: {
        options: wallTextures,
        value: DEFAULT_WALL_TEXTURE,
        label: "Wall Texture",
      },
      floorTexture: {
        options: floorTextures,
        value: DEFAULT_FLOOR_TEXTURE,
        label: "Floor Texture",
      },
      "Reset Room": button(() => {
        setRoomColors({
          wallColor: DEFAULT_WALL_COLOR,
          floorColor: DEFAULT_FLOOR_COLOR,
          wallTexture: DEFAULT_WALL_TEXTURE,
          floorTexture: DEFAULT_FLOOR_TEXTURE,
        });
      }),
    }));

  const { showGrid } = useControls("Grid", {
    showGrid: {
      value: false,
      label: "Show Grid",
    },
  });

  return {
    roomWidth,
    roomHeight,
    showGrid,
    wallColor,
    floorColor,
    wallTexture,
    floorTexture,
  };
}

module.exports = function (api) {
  api.cache(true);
  const expoPreset = [
    "babel-preset-expo",
    {
      jsxImportSource: "nativewind",
      "react-compiler": false,
      worklets: false,
    },
  ];
  return {
    presets: ["nativewind/babel", expoPreset],
  };
};

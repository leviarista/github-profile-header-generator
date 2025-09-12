import presets from "./data/presets.json";
import { updateBanner, updateUIOptions } from "./banner";

function getAllPresets() {
    return presets;
}

function getPreset(index) {
    return presets[index];
}

function getRandomPreset() {
    let random = Math.floor(Math.random() * presets.length);
    return presets[random];
}

function setPreset(preset, ignoreSave = null) {
    updateUIOptions(preset);
    updateBanner({ ...preset, ignoreSave });
}

export {
    getAllPresets,
    getPreset,
    getRandomPreset,
    setPreset,
};

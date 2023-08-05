const translation = {
    "en-US": () => import("./locale/en-US.json").then((module) => module.default),
    "ru-RU": () => import("./locale/ru-RU.json").then((module) => module.default),
};

export type Locale = keyof typeof translation;
export const locales: Locale[] = ["en-US", "ru-RU"];
export const defaultLocale: Locale = "en-US";
export const getTranslation = async (locale: Locale) => translation[locale]();

import { getRequestConfig } from "next-intl/server";
import { locales, defaultLocale } from "@/lib/i18n/locales";

export default getRequestConfig(async ({ locale }) => {
  // invalid locale fallback
  if (!locales.includes(locale as any)) {
    locale = defaultLocale;
  }

  return {
    messages: (await import(`@/messages/${locale}.json`)).default,
  };
});

import type { Href } from "expo-router";

export function appHref(href: Href | (string & {})): Href {
  return href as Href;
}

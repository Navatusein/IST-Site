import {PermissionType} from "@/shared/types/permissions";

export default function resolveRequirementPermission(permissions: PermissionType, currentPath: string) {
  return Object.entries(permissions).find(([key, permission]) => {
    return permission.paths.find((path) => {
      // Экранируем слеши
      let regexPattern = path.replace(/\//g, "\\/");

      // Заменяем [...param] на "любые сегменты, включая слеши" (ноль или больше)
      regexPattern = regexPattern.replace(/\[\.\.\.(\w+)\]/g, "(?:.+)");

      // Заменяем [[...param]] на "опционально любые сегменты"
      regexPattern = regexPattern.replace(/\[\[\.\.\.(\w+)\]\]/g, "(?:.*)?");

      // Заменяем [param] на "любой один сегмент"
      regexPattern = regexPattern.replace(/\[(\w+)\]/g, "[^/]+");

      // Строим финальное регулярное выражение
      const regex = new RegExp(`^${regexPattern}$`);
      return regex.test(currentPath);
    })
  })?.[0];
}
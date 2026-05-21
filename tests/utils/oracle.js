import { z } from "zod";

/**
 * Oráculo de esquema para un Preset.
 * Valida que cada preset del JSON tenga la estructura correcta.
 */
export const PresetSchema = z.object({
  background: z
    .string()
    .regex(/^#[0-9A-Fa-f]{3,8}$/, "background debe ser un color hex válido"),
  padding: z.number().min(0).optional(),
  titleColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{3,8}$/)
    .optional(),
  subtitleColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{3,8}$/)
    .optional(),
  borderColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{3,8}$/)
    .optional(),
  borderSize: z.number().min(0).optional(),
  borderRadius: z.number().min(0).optional(),
  textAlign: z.enum(["flex-start", "center", "flex-end"]).optional(),
  decoration: z.string().optional(),
  decorationSize: z.number().min(0).optional(),
  pattern: z.string().optional(),
  patternColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{3,8}$/)
    .optional(),
  patternSize: z.number().positive().optional(),
  patternOpacity: z.number().min(0).max(1).optional(),
  titleFontSize: z.number().positive().optional(),
  subtitleFontSize: z.number().positive().optional(),
  titleFont: z.string().optional(),
  subtitleFont: z.string().optional(),
  previewImage: z.string().optional(),
});

/**
 * Oráculo de esquema para un Tema completo (extiende Preset).
 */
export const ThemeSchema = PresetSchema.extend({
  title: z.string().optional(),
  subtitle: z.string().optional(),
  ignoreSave: z.boolean().optional(),
  decorationLocal: z.boolean().optional(),
});

/**
 * Oráculo para el resultado de getPattern.
 * Una cadena CSS válida empieza con url( y contiene un SVG inline,
 * o es exactamente 'none' para patrones desconocidos.
 */
export const PatternResultSchema = z.union([
  z
    .string()
    .startsWith('url("data:image/svg+xml,', "Debe ser un url() con SVG inline"),
  z.literal("none"),
]);

/**
 * Valida que todos los presets de un array cumplan el esquema.
 * Retorna un array de errores (vacío si todos son válidos).
 */
export function validateAllPresets(presets) {
  return presets
    .map((preset, index) => {
      const result = PresetSchema.safeParse(preset);
      if (!result.success) {
        return { index, errors: result.error.issues };
      }
      return null;
    })
    .filter(Boolean);
}

/**
 * Types and interfaces for the newsletter application
 */

/**
 * Screenshot-related types
 */
export interface ScreenshotData {
  /** Base64 encoded image data */
  data: string
  /** MIME type of the image (e.g., "image/png", "image/jpeg") */
  mimeType: string
  /** Width of the screenshot in pixels */
  width: number
  /** Height of the screenshot in pixels */
  height: number
  /** File size in bytes */
  size: number
  /** Timestamp when screenshot was captured */
  capturedAt: Date
}

/**
 * Validated screenshot data for storage
 */
export interface ValidatedScreenshot {
  /** Base64 encoded image data with data URL prefix */
  dataUrl: string
  /** MIME type */
  mimeType: string
  /** Dimensions */
  width: number
  height: number
  /** File size in bytes */
  size: number
}

/**
 * Screenshot validation result
 */
export interface ScreenshotValidationResult {
  isValid: boolean
  error?: string
  screenshot?: ValidatedScreenshot
}

/**
 * Screenshot capture options
 */
export interface ScreenshotCaptureOptions {
  /** Target element to capture */
  element?: HTMLElement
  /** HTML content to render and capture */
  htmlContent?: string
  /** Output format (default: "png") */
  format?: "png" | "jpeg" | "webp"
  /** Quality for lossy formats (0-1, default: 0.92) */
  quality?: number
  /** Scale factor for high-DPI displays (default: 2) */
  scale?: number
  /** Maximum width in pixels */
  maxWidth?: number
  /** Maximum height in pixels */
  maxHeight?: number
  /** Background color (default: "white") */
  backgroundColor?: string
  /** Whether to auto-resize large images to fit within max dimensions */
  autoResize?: boolean
}

/**
 * Template screenshot metadata
 */
export interface TemplateScreenshot {
  /** Base64 encoded screenshot data */
  previewImage: string
  /** Screenshot dimensions */
  dimensions: {
    width: number
    height: number
  }
  /** Screenshot capture timestamp */
  capturedAt: Date
  /** Screenshot format */
  format: string
  /** File size in bytes */
  size: number
}

/**
 * Email template with enhanced screenshot support
 */
export interface EmailTemplate {
  id: string
  name: string
  description: string
  category: string
  content: string
  isHtml: boolean
  /** Enhanced screenshot data */
  screenshot?: TemplateScreenshot
  createdAt: Date
  updatedAt: Date
  usage: number
}

/**
 * Screenshot storage configuration
 */
export interface ScreenshotConfig {
  /** Maximum file size in bytes (default: 1MB) */
  maxSize: number
  /** Allowed MIME types */
  allowedTypes: string[]
  /** Maximum dimensions */
  maxDimensions: {
    width: number
    height: number
  }
  /** Compression quality for lossy formats */
  compressionQuality: number
  /** Whether to auto-resize large images */
  autoResize: boolean
}

/**
 * Default screenshot configuration
 */
export const DEFAULT_SCREENSHOT_CONFIG: ScreenshotConfig = {
  maxSize: 1024 * 1024, // 1MB
  allowedTypes: ["image/png", "image/jpeg", "image/webp"],
  maxDimensions: {
    width: 1200, // More reasonable for email templates
    height: 1600 // More reasonable for email templates
  },
  compressionQuality: 0.92,
  autoResize: true
}

import html2canvas from 'html2canvas'
import { 
  ScreenshotData, 
  ValidatedScreenshot, 
  ScreenshotValidationResult, 
  ScreenshotCaptureOptions,
  DEFAULT_SCREENSHOT_CONFIG 
} from './types'

/**
 * Resizes an image to fit within maximum dimensions while maintaining aspect ratio
 */
function resizeImageToFit(
  width: number, 
  height: number, 
  maxWidth: number, 
  maxHeight: number
): { width: number; height: number } {
  const aspectRatio = width / height
  const maxAspectRatio = maxWidth / maxHeight
  
  let newWidth = width
  let newHeight = height
  
  if (width > maxWidth || height > maxHeight) {
    if (aspectRatio > maxAspectRatio) {
      // Width is the limiting factor
      newWidth = maxWidth
      newHeight = Math.round(maxWidth / aspectRatio)
    } else {
      // Height is the limiting factor
      newHeight = maxHeight
      newWidth = Math.round(maxHeight * aspectRatio)
    }
  }
  
  return { width: newWidth, height: newHeight }
}

/**
 * Handles CORS issues with external images by creating a more robust image handling system
 */
function handleExternalImages(clonedDoc: Document): void {
  const images = clonedDoc.querySelectorAll('img')
  
  images.forEach((img) => {
    if (img.src && img.src.startsWith('http')) {
      // Try to handle CORS issues
      img.crossOrigin = 'anonymous'
      
      // Add error handling for failed images
      img.onerror = () => {
        // Create a placeholder for failed images
        const placeholder = document.createElement('div')
        const imgWidth = img.width || 100
        const imgHeight = img.height || 100
        placeholder.style.width = `${imgWidth}px`
        placeholder.style.height = `${imgHeight}px`
        placeholder.style.backgroundColor = '#f0f0f0'
        placeholder.style.border = '1px dashed #ccc'
        placeholder.style.display = 'flex'
        placeholder.style.alignItems = 'center'
        placeholder.style.justifyContent = 'center'
        placeholder.style.fontSize = '12px'
        placeholder.style.color = '#666'
        placeholder.textContent = 'Image'
        
        // Replace the failed image with placeholder
        if (img.parentNode) {
          img.parentNode.replaceChild(placeholder, img)
        }
      }
      
      // Add timeout for slow-loading images
      const timeout = setTimeout(() => {
        if (img.complete === false) {
          if (img.onerror) {
            img.onerror(new Event('error'))
          }
        }
      }, 5000) // 5 second timeout
      
      img.onload = () => {
        clearTimeout(timeout)
      }
    }
  })
}

/**
 * Creates a simplified version of HTML content without external images for CORS-safe screenshot capture
 */
function createCorsSafeContent(htmlContent: string): string {
  // Create a temporary div to parse and modify the HTML
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = htmlContent
  
  // Replace external images with placeholders
  const images = tempDiv.querySelectorAll('img')
  images.forEach((img) => {
    if (img.src && img.src.startsWith('http')) {
      const placeholder = document.createElement('div')
      const imgWidth = img.width || 100
      const imgHeight = img.height || 100
      placeholder.style.width = `${imgWidth}px`
      placeholder.style.height = `${imgHeight}px`
      placeholder.style.backgroundColor = '#f0f0f0'
      placeholder.style.border = '1px dashed #ccc'
      placeholder.style.display = 'flex'
      placeholder.style.alignItems = 'center'
      placeholder.style.justifyContent = 'center'
      placeholder.style.fontSize = '12px'
      placeholder.style.color = '#666'
      placeholder.textContent = 'Image'
      
      if (img.parentNode) {
        img.parentNode.replaceChild(placeholder, img)
      }
    }
  })
  
  return tempDiv.innerHTML
}

/**
 * Captures a screenshot of a DOM element using html2canvas
 * @param element - The HTML element to capture
 * @param options - Screenshot capture options
 * @returns Promise resolving to screenshot data
 */
export async function captureTemplateScreenshot(
  element: HTMLElement, 
  options: Partial<ScreenshotCaptureOptions> = {}
): Promise<ScreenshotData> {
  const config = { ...DEFAULT_SCREENSHOT_CONFIG, ...options }
  
  try {
    // Calculate dimensions with auto-resize if enabled
    let targetWidth = config.maxWidth || element.offsetWidth
    let targetHeight = config.maxHeight || element.offsetHeight
    
    if (config.autoResize && config.maxWidth && config.maxHeight) {
      const resized = resizeImageToFit(
        element.offsetWidth, 
        element.offsetHeight, 
        config.maxWidth, 
        config.maxHeight
      )
      targetWidth = resized.width
      targetHeight = resized.height
    }
    
    const canvas = await html2canvas(element, {
      scale: config.scale || 2,
      backgroundColor: config.backgroundColor || '#ffffff',
      width: targetWidth,
      height: targetHeight,
      useCORS: true,
      allowTaint: true,
      logging: false,
      // Additional options for better CORS handling
      foreignObjectRendering: false,
      removeContainer: true,
      // Handle external images better
      onclone: handleExternalImages
    })

    const format = config.format || 'png'
    const quality = config.compressionQuality || 0.92
    
    let dataUrl: string
    if (format === 'jpeg' || format === 'webp') {
      dataUrl = canvas.toDataURL(`image/${format}`, quality)
    } else {
      dataUrl = canvas.toDataURL('image/png')
    }

    const base64Data = dataUrl.split(',')[1]
    const size = Math.ceil((base64Data.length * 3) / 4) // Approximate size calculation

    return {
      data: base64Data,
      mimeType: `image/${format}`,
      width: canvas.width,
      height: canvas.height,
      size,
      capturedAt: new Date()
    }
  } catch (error) {
    throw new Error(`Failed to capture screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Captures a screenshot from HTML content by rendering it in a temporary element
 * @param emailContent - HTML content to render and capture
 * @param options - Screenshot capture options
 * @returns Promise resolving to screenshot data
 */
export async function captureEmailPreviewScreenshot(
  emailContent: string, 
  options: Partial<ScreenshotCaptureOptions> = {}
): Promise<ScreenshotData> {
  const config = { ...DEFAULT_SCREENSHOT_CONFIG, ...options }
  
  try {
    // Create a temporary container
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.top = '-9999px'
    tempContainer.style.width = '600px' // Standard email width
    tempContainer.style.backgroundColor = config.backgroundColor || '#ffffff'
    tempContainer.style.padding = '20px'
    tempContainer.style.boxSizing = 'border-box'
    
    // Set the HTML content
    tempContainer.innerHTML = emailContent
    
    // Add to DOM temporarily
    document.body.appendChild(tempContainer)
    
    try {
      // First attempt: Try to capture with original content
      console.log('Attempting screenshot capture with original content...')
      const screenshot = await captureTemplateScreenshot(tempContainer, {
        ...config,
        autoResize: true,
        maxWidth: config.maxWidth || 1200, // More reasonable max width for emails
        maxHeight: config.maxHeight || 1600 // More reasonable max height for emails
      })
      
      console.log('Screenshot captured successfully:', {
        width: screenshot.width,
        height: screenshot.height,
        size: screenshot.size
      })
      
      // Clean up
      document.body.removeChild(tempContainer)
      
      return screenshot
    } catch (error) {
      // If first attempt fails, try with CORS-safe content
      console.warn('First screenshot attempt failed, trying with CORS-safe content:', error)
      
      // Update content to be CORS-safe
      tempContainer.innerHTML = createCorsSafeContent(emailContent)
      
      try {
        console.log('Attempting screenshot capture with CORS-safe content...')
        const fallbackScreenshot = await captureTemplateScreenshot(tempContainer, {
          ...config,
          autoResize: true,
          maxWidth: config.maxWidth || 1200,
          maxHeight: config.maxHeight || 1600
        })
        
        console.log('Fallback screenshot captured successfully:', {
          width: fallbackScreenshot.width,
          height: fallbackScreenshot.height,
          size: fallbackScreenshot.size
        })
        
        // Clean up
        document.body.removeChild(tempContainer)
        
        return fallbackScreenshot
      } catch (fallbackError) {
        // Clean up on error
        document.body.removeChild(tempContainer)
        throw new Error(`Both screenshot attempts failed. Original: ${error instanceof Error ? error.message : 'Unknown error'}, Fallback: ${fallbackError instanceof Error ? fallbackError.message : 'Unknown error'}`)
      }
    }
  } catch (error) {
    throw new Error(`Failed to capture email preview screenshot: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Validates screenshot data before storage
 * @param screenshot - Screenshot data to validate
 * @param config - Validation configuration
 * @returns Validation result
 */
export function validateScreenshot(
  screenshot: ScreenshotData, 
  config: Partial<typeof DEFAULT_SCREENSHOT_CONFIG> = {}
): ScreenshotValidationResult {
  const validationConfig = { ...DEFAULT_SCREENSHOT_CONFIG, ...config }
  
  try {
    // Check file size
    if (screenshot.size > validationConfig.maxSize) {
      return {
        isValid: false,
        error: `Screenshot size (${screenshot.size} bytes) exceeds maximum allowed size (${validationConfig.maxSize} bytes)`
      }
    }
    
    // Check dimensions
    if (screenshot.width > validationConfig.maxDimensions.width || 
        screenshot.height > validationConfig.maxDimensions.height) {
      return {
        isValid: false,
        error: `Screenshot dimensions (${screenshot.width}x${screenshot.height}) exceed maximum allowed dimensions (${validationConfig.maxDimensions.width}x${validationConfig.maxDimensions.height})`
      }
    }
    
    // Check MIME type
    if (!validationConfig.allowedTypes.includes(screenshot.mimeType)) {
      return {
        isValid: false,
        error: `Screenshot MIME type (${screenshot.mimeType}) is not allowed. Allowed types: ${validationConfig.allowedTypes.join(', ')}`
      }
    }
    
    // Create validated screenshot
    const validatedScreenshot: ValidatedScreenshot = {
      dataUrl: `data:${screenshot.mimeType};base64,${screenshot.data}`,
      mimeType: screenshot.mimeType,
      width: screenshot.width,
      height: screenshot.height,
      size: screenshot.size
    }
    
    return {
      isValid: true,
      screenshot: validatedScreenshot
    }
  } catch (error) {
    return {
      isValid: false,
      error: `Validation error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Converts screenshot data to a data URL for display
 * @param screenshot - Screenshot data
 * @returns Data URL string
 */
export function screenshotToDataUrl(screenshot: ScreenshotData): string {
  return `data:${screenshot.mimeType};base64,${screenshot.data}`
}

/**
 * Compresses screenshot data to reduce file size
 * @param screenshot - Screenshot data to compress
 * @param quality - Compression quality (0-1)
 * @returns Promise resolving to compressed screenshot data
 */
export async function compressScreenshot(
  screenshot: ScreenshotData, 
  quality: number = 0.8
): Promise<ScreenshotData> {
  try {
    // Create a canvas to compress the image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (!ctx) {
      throw new Error('Failed to get canvas context')
    }
    
    // Create an image element
    const img = new Image()
    const dataUrl = screenshotToDataUrl(screenshot)
    
    return new Promise((resolve, reject) => {
      img.onload = () => {
        try {
          canvas.width = img.width
          canvas.height = img.height
          
          // Draw the image
          ctx.drawImage(img, 0, 0)
          
          // Compress
          const compressedDataUrl = canvas.toDataURL(screenshot.mimeType, quality)
          const compressedBase64 = compressedDataUrl.split(',')[1]
          const compressedSize = Math.ceil((compressedBase64.length * 3) / 4)
          
          resolve({
            ...screenshot,
            data: compressedBase64,
            size: compressedSize
          })
        } catch (error) {
          reject(new Error(`Compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
        }
      }
      
      img.onerror = () => {
        reject(new Error('Failed to load image for compression'))
      }
      
      img.src = dataUrl
    })
  } catch (error) {
    throw new Error(`Compression error: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Automatically compresses and resizes screenshots that exceed limits
 */
export async function autoOptimizeScreenshot(
  screenshot: ScreenshotData,
  config: Partial<typeof DEFAULT_SCREENSHOT_CONFIG> = {}
): Promise<ScreenshotData> {
  const validationConfig = { ...DEFAULT_SCREENSHOT_CONFIG, ...config }
  let optimizedScreenshot = screenshot
  
  // Check if we need to resize due to dimensions
  if (screenshot.width > validationConfig.maxDimensions.width || 
      screenshot.height > validationConfig.maxDimensions.height) {
    const resized = resizeImageToFit(
      screenshot.width,
      screenshot.height,
      validationConfig.maxDimensions.width,
      validationConfig.maxDimensions.height
    )
    
    // Create a canvas to resize the image
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    if (ctx) {
      canvas.width = resized.width
      canvas.height = resized.height
      
      // Create an image element to resize
      const img = new Image()
      const dataUrl = screenshotToDataUrl(screenshot)
      
      return new Promise((resolve, reject) => {
        img.onload = () => {
          try {
            // Draw the resized image
            ctx.drawImage(img, 0, 0, resized.width, resized.height)
            
            // Get the resized data
            const resizedDataUrl = canvas.toDataURL(screenshot.mimeType, validationConfig.compressionQuality)
            const resizedBase64 = resizedDataUrl.split(',')[1]
            const resizedSize = Math.ceil((resizedBase64.length * 3) / 4)
            
            resolve({
              ...screenshot,
              data: resizedBase64,
              width: resized.width,
              height: resized.height,
              size: resizedSize
            })
          } catch (error) {
            reject(new Error(`Resize failed: ${error instanceof Error ? error.message : 'Unknown error'}`))
          }
        }
        
        img.onerror = () => {
          reject(new Error('Failed to load image for resizing'))
        }
        
        img.src = dataUrl
      })
    }
  }
  
  // Check if we need to compress due to size
  if (screenshot.size > validationConfig.maxSize) {
    try {
      optimizedScreenshot = await compressScreenshot(screenshot, validationConfig.compressionQuality)
    } catch (error) {
      console.warn('Failed to compress screenshot:', error)
    }
  }
  
  return optimizedScreenshot
}

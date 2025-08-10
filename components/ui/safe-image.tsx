"use client"

import { useState } from 'react'
import Image from 'next/image'

interface SafeImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
}

export function SafeImage({ 
  src, 
  alt, 
  width = 100, 
  height = 100, 
  className = "",
  fallbackSrc = "/placeholder.svg"
}: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  const handleError = () => {
    if (!hasError && !imgSrc.includes('/api/proxy-image')) {
      setHasError(true)
      // Only try proxy once, then fallback
      if (src.startsWith('http') && !src.includes('localhost')) {
        setImgSrc(`/api/proxy-image?url=${encodeURIComponent(src)}`)
      } else {
        setImgSrc(fallbackSrc)
      }
    } else {
      // If proxy fails or already tried, use fallback
      setImgSrc(fallbackSrc)
    }
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      unoptimized={src.startsWith('http') && !src.includes('localhost')}
    />
  )
}

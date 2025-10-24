'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

const WatermarkedImage = ({
  src,
  alt,
  fill = false,
  width,
  height,
  className = '',
  style = {},
  priority = false
}) => {
  const canvasRef = useRef(null);
  const [watermarkedSrc, setWatermarkedSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!src) {
      setIsLoading(false);
      return;
    }

    const addWatermark = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      const img = new window.Image();

      img.crossOrigin = 'anonymous';
      img.src = src;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw original image
        ctx.drawImage(img, 0, 0);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        ctx.save();
        ctx.globalAlpha = 1.0;

        const logo = new window.Image();
        logo.crossOrigin = 'anonymous';
        logo.src = 'https://res.cloudinary.com/dqbbm0guw/image/upload/v1734025110/logo_white_1_qaba_tm9dph.png';

        logo.onload = () => {
          const logoSize = 60;
          const logoX = centerX - logoSize / 2;
          const logoY = centerY - logoSize / 2 - 30;

          // Draw logo in semi-transparent white
          ctx.filter = 'brightness(0) invert(1) opacity(0.4)';
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
          ctx.filter = 'none';

          // Add text below logo with normal font weight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.font = '40px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 2;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;

          ctx.fillText('Qarba Properties', centerX, centerY + 40);
          ctx.restore();

          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setWatermarkedSrc(dataUrl);
          setIsLoading(false);
        };

        logo.onerror = () => {
          // Fallback: text only with normal font weight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.font = '40px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
          ctx.shadowBlur = 2;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;

          ctx.fillText('Qarba Properties', centerX, centerY);
          ctx.restore();

          const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
          setWatermarkedSrc(dataUrl);
          setIsLoading(false);
        };
      };

      img.onerror = () => {
        console.error('Failed to load image for watermarking');
        setIsLoading(false);
      };
    };

    addWatermark();
  }, [src]);

  if (isLoading || !watermarkedSrc) {
    return (
      <>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {fill ? (
          <Image
            src={src || '/proper.png'}
            alt={alt}
            fill
            className={className}
            style={style}
            priority={priority}
          />
        ) : (
          <Image
            src={src || '/proper.png'}
            alt={alt}
            width={width}
            height={height}
            className={className}
            style={style}
            priority={priority}
          />
        )}
      </>
    );
  }

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      {fill ? (
        <Image
          src={watermarkedSrc}
          alt={alt}
          fill
          className={className}
          style={style}
          priority={priority}
          unoptimized
        />
      ) : (
        <Image
          src={watermarkedSrc}
          alt={alt}
          width={width}
          height={height}
          className={className}
          style={style}
          priority={priority}
          unoptimized
        />
      )}
    </>
  );
};

export default WatermarkedImage;

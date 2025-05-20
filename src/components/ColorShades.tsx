import React, { useState, useEffect } from 'react'
import { generateShades } from '../utils/colorUtils'
import './ColorShades.css'

interface ColorShadesProps {
  baseColor: string;
  colorName: string;
  isPrimary?: boolean;
  description?: string;
}

const getColorName = (hex: string): string => {
  // Simple color name mapping - you can expand this
  const colorMap: { [key: string]: string } = {
    '#FF0000': 'Red',
    '#00FF00': 'Green',
    '#0000FF': 'Blue',
    '#FFFF00': 'Yellow',
    '#FF00FF': 'Magenta',
    '#00FFFF': 'Cyan',
    '#FFA500': 'Orange',
    '#800080': 'Purple',
    '#008000': 'Forest',
    '#000080': 'Navy',
    '#FFC0CB': 'Pink',
    '#A52A2A': 'Brown',
    '#808080': 'Gray',
    '#FFD700': 'Gold',
    '#4B0082': 'Indigo',
    '#40E0D0': 'Turquoise',
    '#8B4513': 'Saddle',
    '#4682B4': 'Steel',
    '#9370DB': 'Medium Purple',
    '#3CB371': 'Sea Green',
  }
  
  // Find the closest color name by comparing hex values
  let minDistance = Infinity
  let closestColor = 'Gray'
  
  const hexToRgb = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    return [r, g, b]
  }
  
  const colorDistance = (rgb1: number[], rgb2: number[]) => {
    return Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
    )
  }
  
  const targetRgb = hexToRgb(hex)
  
  Object.entries(colorMap).forEach(([hexValue, name]) => {
    const currentRgb = hexToRgb(hexValue)
    const distance = colorDistance(targetRgb, currentRgb)
    if (distance < minDistance) {
      minDistance = distance
      closestColor = name
    }
  })
  
  return closestColor
}

const ColorShades: React.FC<ColorShadesProps> = ({ baseColor, colorName, isPrimary, description }) => {
  const [showToast, setShowToast] = useState(false);
  const colorDisplayName = getColorName(baseColor)
  const shades = generateShades(baseColor).map((color, i) => ({
    level: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900][i],
    color,
    isPrimaryShade: i === 6  // 600이 primary color
  }))

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  const handleColorClick = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setShowToast(true);
  };

  return (
    <div className="color-shades">
      <div className="color-title">
        <h3>{colorDisplayName} ({baseColor})</h3>
      </div>
      {description && (
        <p className="color-description">{description}</p>
      )}
      <div className="shades-grid">
        {shades.map(({ level, color, isPrimaryShade }) => (
          <div key={level} className="shade-item">
            <div 
              className={`color-box ${isPrimary && isPrimaryShade ? 'primary-shade' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
              title="클릭하여 컬러 코드 복사"
            >
              {isPrimary && isPrimaryShade && (
                <span className="primary-star">★</span>
              )}
            </div>
            <span className="shade-label">{colorDisplayName}{level}</span>
            <span className="color-code">{color}</span>
          </div>
        ))}
      </div>
      <div className={`toast ${showToast ? 'show' : ''}`}>
        코드가 복사됐어요!
      </div>
    </div>
  )
}

export default ColorShades 
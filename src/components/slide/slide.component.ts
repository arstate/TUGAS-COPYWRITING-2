import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Slide } from '../../slide.interface';

@Component({
  selector: 'app-slide',
  templateUrl: './slide.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
})
export class SlideComponent {
  slide = input.required<Slide>();
  
  isArray(content: any): content is string[] {
    return Array.isArray(content);
  }

  getBranchStyle(index: number): { [key: string]: string } {
    // [translateX%, translateY%]
    const positions: { [key: number]: [number, number] } = {
      4: [-85, -120],  // Ahli Membuat Headline (Top-left)
      5: [85, -120],   // Paham Karakteristik Media (Top-right)
      3: [-165, 0],    // Pemahaman Audiens (Left)
      0: [165, 0],     // Kreativitas Tinggi (Right)
      2: [-85, 120],   // Keterampilan Riset (Bottom-left)
      1: [85, 120],    // Kemampuan Menulis (Bottom-right)
    };
    const [x, y] = positions[index] || [0, 0];
    
    // Constants for calculation in rems
    const branchWidthRem = 15; // Corresponds to w-60
    const centerRadiusRem = 8;  // Corresponds to half of w-64

    // Calculate distance from map center to branch center in rems
    const distanceXRem = Math.abs(x / 100 * branchWidthRem);
    const distanceYRem = Math.abs(y / 100 * branchWidthRem);
    const centerToCenterDistanceRem = Math.sqrt(distanceXRem ** 2 + distanceYRem ** 2);

    // Line length is the distance between centers minus the radius of the central circle
    // Add a small overlap (e.g., 1rem) to ensure it connects cleanly behind the circle
    const lineLengthRem = Math.max(0, centerToCenterDistanceRem - centerRadiusRem + 1);

    // Calculate the angle to point from the branch back to the center.
    // CSS rotate(0deg) is UP. atan2 has 0deg as RIGHT.
    // We add 90deg to align atan2's coordinate system with CSS rotate.
    const angleDeg = (Math.atan2(-y, -x) * 180 / Math.PI) + 90;

    return { 
      '--translateX': `${x}%`,
      '--translateY': `${y}%`,
      'transform': `translate(var(--translateX), var(--translateY))`,
      '--rotation': `${angleDeg}deg`,
      '--line-length': `${lineLengthRem}rem`,
    };
  }

  getBranchAnimationDelay(index: number): { 'animation-delay': string } {
    // Create a visually pleasing animation sequence (clockwise)
    const animationOrder = [4, 5, 0, 1, 2, 3];
    const orderedIndex = animationOrder.indexOf(index);
    return { 'animation-delay': `${orderedIndex * 100}ms` };
  }
}
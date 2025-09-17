// cameraValidation.test.js
// Simple test utilities for camera validation functionality

import { validateFrame, startCamera, stopCamera, capturePhoto } from './cameraValidation';

// Test function to verify camera validation works
export async function testCameraValidation() {
  console.log('🧪 Testing Camera Validation...');
  
  try {
    // Test 1: Check if getUserMedia is available
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('getUserMedia not supported');
    }
    console.log('✅ getUserMedia is supported');

    // Test 2: Try to access camera
    const stream = await startCamera({ 
      video: { 
        facingMode: "user",
        width: { ideal: 640 },
        height: { ideal: 480 }
      } 
    });
    console.log('✅ Camera access successful');

    // Test 3: Create a test video element
    const video = document.createElement('video');
    video.srcObject = stream;
    video.muted = true;
    video.playsInline = true;
    
    return new Promise((resolve, reject) => {
      video.onloadedmetadata = async () => {
        try {
          video.play();
          
          // Wait a bit for video to start
          setTimeout(async () => {
            try {
              // Test 4: Validate frame
              const result = await validateFrame(video);
              console.log('✅ Frame validation successful');
              console.log('📊 Validation results:', result);
              
              // Test 5: Capture photo
              const photoDataUrl = capturePhoto(video);
              console.log('✅ Photo capture successful');
              console.log('📸 Photo data URL length:', photoDataUrl.length);
              
              // Cleanup
              stopCamera(stream);
              console.log('✅ Camera cleanup successful');
              
              resolve({
                success: true,
                validation: result,
                photoLength: photoDataUrl.length
              });
            } catch (error) {
              console.error('❌ Validation/Capture error:', error);
              stopCamera(stream);
              reject(error);
            }
          }, 2000);
        } catch (error) {
          console.error('❌ Video play error:', error);
          stopCamera(stream);
          reject(error);
        }
      };
      
      video.onerror = (error) => {
        console.error('❌ Video load error:', error);
        stopCamera(stream);
        reject(error);
      };
    });
  } catch (error) {
    console.error('❌ Camera test failed:', error);
    throw error;
  }
}

// Test function for PWA compatibility
export function testPWACompatibility() {
  console.log('🧪 Testing PWA Compatibility...');
  
  const tests = [
    {
      name: 'Service Worker Support',
      test: () => 'serviceWorker' in navigator,
      result: 'serviceWorker' in navigator
    },
    {
      name: 'Camera API Support',
      test: () => navigator.mediaDevices && navigator.mediaDevices.getUserMedia,
      result: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia)
    },
    {
      name: 'Canvas Support',
      test: () => document.createElement('canvas').getContext,
      result: !!document.createElement('canvas').getContext
    },
    {
      name: 'ImageData Support',
      test: () => window.ImageData,
      result: !!window.ImageData
    },
    {
      name: 'RequestAnimationFrame Support',
      test: () => window.requestAnimationFrame,
      result: !!window.requestAnimationFrame
    },
    {
      name: 'HTTPS/HTTP Context',
      test: () => location.protocol === 'https:' || location.hostname === 'localhost',
      result: location.protocol === 'https:' || location.hostname === 'localhost'
    }
  ];

  tests.forEach(test => {
    console.log(`${test.result ? '✅' : '❌'} ${test.name}: ${test.result}`);
  });

  const passedTests = tests.filter(test => test.result).length;
  const totalTests = tests.length;
  
  console.log(`📊 PWA Compatibility: ${passedTests}/${totalTests} tests passed`);
  
  return {
    passed: passedTests,
    total: totalTests,
    percentage: Math.round((passedTests / totalTests) * 100)
  };
}

// Run tests if called directly
if (typeof window !== 'undefined') {
  window.testCameraValidation = testCameraValidation;
  window.testPWACompatibility = testPWACompatibility;
  
  console.log('🔧 Camera validation tests loaded. Use testCameraValidation() or testPWACompatibility() in console.');
}

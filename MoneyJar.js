// Top-level log to verify if MoneyJar.js is loaded
console.log("MoneyJar file loaded");

import React, { Suspense, useState, useEffect } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF } from '@react-three/drei/native';
import { Asset } from 'expo-asset';

// Polyfill for document in a React Native environment
if (typeof document === 'undefined') {
  global.document = {
    createElement: () => ({ style: {} }),
    getElementById: () => null,
    body: {},
    contains: () => false,
    addEventListener: () => {},
    removeEventListener: () => {},
  };
}

// Custom hook with extended logging to load an asset and get its URI
function useAssetWithLogging(assetModule) {
  const [uri, setUri] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadAsset() {
      try {
        console.log("useAssetWithLogging: Loading asset for module:", assetModule);
        const asset = Asset.fromModule(assetModule);
        console.log("useAssetWithLogging: Asset object before downloadAsync:", asset);
        await asset.downloadAsync();
        console.log("useAssetWithLogging: Asset object after downloadAsync:", asset);

        const finalUri = asset.localUri || asset.uri;
        console.log("useAssetWithLogging: Final asset URI:", finalUri);
        setUri(finalUri);
      } catch (err) {
        console.error("useAssetWithLogging: Error loading asset:", err);
        setError(err);
      }
    }
    loadAsset();
  }, [assetModule]);

  return { uri, error };
}

// This component will be rendered inside the Canvas
const MoneyJarModel = ({ uri }) => {
  console.log("MoneyJarModel: Rendered with URI:", uri);
  
  if (!uri) {
    return null;
  }
  
  try {
    // Use the useGLTF hook to load the GLB model
    const { scene } = useGLTF(uri);
    return <primitive object={scene} dispose={null} scale={0.5} />;
  } catch (err) {
    console.error("Error rendering GLB:", err);
    // Fallback to a simple shape if there's an error
    return (
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="purple" />
      </mesh>
    );
  }
};

// Simple fallback component for when 3D rendering fails
const FallbackComponent = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 16, textAlign: 'center', color: '#666' }}>
        Unable to load 3D model
      </Text>
      <Text style={{ fontSize: 14, textAlign: 'center', marginTop: 5, color: '#999' }}>
        Please check your device compatibility
      </Text>
    </View>
  );
};

const MoneyJar = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [renderError, setRenderError] = useState(false);
  
  // Use require to load the untitled.glb file instead of MoneyJar.glb
  const assetModule = require('./assets/untitled.glb');
  const { uri, error: assetError } = useAssetWithLogging(assetModule);
  
  useEffect(() => {
    console.log("MoneyJar component mounted");
    
    // Handle dimension changes
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  useEffect(() => {
    if (uri) {
      setIsLoading(false);
    }
    
    if (assetError) {
      setError(assetError.message);
      setIsLoading(false);
    }
  }, [uri, assetError]);
  
  // If there's a rendering error, show the fallback component
  if (renderError) {
    return <FallbackComponent />;
  }
  
  return (
    <View style={{ flex: 1, width: '100%', height: '100%' }}>
      {isLoading && <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading Model...</Text>}
      {error && <Text style={{ textAlign: 'center', marginTop: 20, color: 'red' }}>Error: {error}</Text>}
      
      <Canvas
        style={{ flex: 1 }}
        camera={{ position: [0, 1, 3], fov: 50 }}
        gl={{ antialias: true }}
        onError={(err) => {
          console.error("Canvas error:", err);
          setRenderError(true);
        }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.8} position={[0, 1, 1]} />
        <Suspense fallback={null}>
          {uri && <MoneyJarModel uri={uri} />}
        </Suspense>
      </Canvas>
    </View>
  );
};

export default MoneyJar;

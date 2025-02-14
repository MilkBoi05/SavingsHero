// Top-level log to verify if MoneyJar.js is loaded
console.log("MoneyJar file loaded");

// Log the asset module to verify the relative path and asset resolution
const assetModule = require('./assets/MoneyJar.glb');
console.log("Asset module:", assetModule);

import React, { Suspense, useState, useEffect } from 'react';
import { View, Text } from 'react-native';
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
      }
    }
    loadAsset();
  }, [assetModule]);

  return uri;
}

const MoneyJarModel = () => {
  console.log("MoneyJarModel: Rendered");
  // Use the logged assetModule constant above
  const glbUri = useAssetWithLogging(assetModule);

  if (!glbUri) {
    return <Text>Loading Model...</Text>;
  }

  console.log("MoneyJarModel: Loaded GLB URI:", glbUri);
  const { scene } = useGLTF(glbUri);

  return <primitive object={scene} dispose={null} scale={0.5} />;
};

const MoneyJar = () => {
  useEffect(() => {
    console.log("MoneyJar component mounted");
  }, []);
  
  return (
    <View style={{ flex: 1 }}>
      <Canvas
        style={{ flex: 1 }}
        camera={{ position: [0, 1, 3] }} // Adjust camera position if needed
      >
        <ambientLight intensity={0.5} />
        <directionalLight intensity={0.8} position={[0, 1, 1]} />
        <Suspense fallback={<Text>Loading 3D Model...</Text>}>
          <MoneyJarModel />
        </Suspense>
      </Canvas>
    </View>
  );
};

export default MoneyJar;

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { WebView } from 'react-native-webview';

// HTML content for the WebView that will render a 3D jar
const getWebViewContent = () => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    body { margin: 0; overflow: hidden; }
    canvas { width: 100%; height: 100%; display: block; }
    #loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #333;
      font-family: Arial, sans-serif;
      font-size: 16px;
    }
  </style>
</head>
<body>
  <div id="loading">Loading 3D Money Jar...</div>
  <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/controls/OrbitControls.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/three@0.132.2/examples/js/loaders/GLTFLoader.js"></script>
  <script>
    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8f8f8);
    
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xf8f8f8);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(renderer.domElement);
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    directionalLight.shadow.camera.left = -10;
    directionalLight.shadow.camera.right = 10;
    directionalLight.shadow.camera.top = 10;
    directionalLight.shadow.camera.bottom = -10;
    scene.add(directionalLight);
    
    // Add a subtle rim light
    const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
    rimLight.position.set(-5, 3, -5);
    scene.add(rimLight);
    
    // Set camera position
    camera.position.set(0, 2, 8);
    
    // Add orbit controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 5;
    controls.maxDistance = 15;
    
    // Create a group to hold the jar and money
    const jarGroup = new THREE.Group();
    scene.add(jarGroup);
    
    // Load the GLTF model
    const loader = new THREE.GLTFLoader();
    const loadingElement = document.getElementById('loading');
    
    // Try to load the model with a more reliable approach
    try {
      // First try loading from the assets folder
      loader.load(
        'assets/moneyjar.gltf',
        function (gltf) {
          // Hide loading message
          loadingElement.style.display = 'none';
          
          // Add the model to the scene
          const model = gltf.scene;
          
          // Scale the model if needed
          model.scale.set(1, 1, 1);
          
          // Position the model
          model.position.set(0, 0, 0);
          
          // Add the model to the jar group
          jarGroup.add(model);
          
          // Add money to the jar
          addMoneyToJar();
        },
        function (xhr) {
          // Loading progress
          const percent = (xhr.loaded / xhr.total) * 100;
          loadingElement.textContent = 'Loading 3D Model: ' + Math.round(percent) + '%';
        },
        function (error) {
          console.error('Error loading GLTF model from assets folder:', error);
          
          // Try loading from the root directory as a fallback
          loader.load(
            'moneyjar.gltf',
            function (gltf) {
              // Hide loading message
              loadingElement.style.display = 'none';
              
              // Add the model to the scene
              const model = gltf.scene;
              
              // Scale the model if needed
              model.scale.set(1, 1, 1);
              
              // Position the model
              model.position.set(0, 0, 0);
              
              // Add the model to the jar group
              jarGroup.add(model);
              
              // Add money to the jar
              addMoneyToJar();
            },
            function (xhr) {
              // Loading progress
              const percent = (xhr.loaded / xhr.total) * 100;
              loadingElement.textContent = 'Loading 3D Model: ' + Math.round(percent) + '%';
            },
            function (error) {
              console.error('Error loading GLTF model from root directory:', error);
              loadingElement.textContent = 'Error loading 3D Model. Using fallback.';
              
              // Create a simple fallback jar
              createJar();
              addMoneyToJar();
            }
          );
        }
      );
    } catch (error) {
      console.error('Error in model loading process:', error);
      loadingElement.textContent = 'Error in model loading process. Using fallback.';
      
      // Create a simple fallback jar
      createJar();
      addMoneyToJar();
    }
    
    // Create a realistic glass material
    function createGlassMaterial() {
      return new THREE.MeshPhysicalMaterial({
        color: 0x4a90e2,
        transparent: true,
        opacity: 0.6,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });
    }
    
    // Create the jar
    function createJar() {
      // Jar body (slightly tapered cylinder)
      const jarGeometry = new THREE.CylinderGeometry(1, 0.85, 2.2, 32);
      const jarMaterial = createGlassMaterial();
      const jar = new THREE.Mesh(jarGeometry, jarMaterial);
      jar.position.y = 0;
      jar.castShadow = true;
      jar.receiveShadow = true;
      jarGroup.add(jar);
      
      // Inner surface of the jar (for better glass effect)
      const innerGeometry = new THREE.CylinderGeometry(0.95, 0.8, 2.1, 32);
      const innerMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x4a90e2,
        transparent: true,
        opacity: 0.3,
        metalness: 0.1,
        roughness: 0.1,
        transmission: 0.9,
        thickness: 0.5,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1
      });
      const inner = new THREE.Mesh(innerGeometry, innerMaterial);
      inner.position.y = 0;
      jarGroup.add(inner);
      
      // Top edge (rounded)
      const topEdgeGeometry = new THREE.TorusGeometry(1, 0.05, 16, 32);
      const topEdgeMaterial = createGlassMaterial();
      const topEdge = new THREE.Mesh(topEdgeGeometry, topEdgeMaterial);
      topEdge.position.y = 1.1;
      topEdge.rotation.x = Math.PI / 2;
      jarGroup.add(topEdge);
      
      // Bottom edge (rounded)
      const bottomEdgeGeometry = new THREE.TorusGeometry(0.85, 0.05, 16, 32);
      const bottomEdgeMaterial = createGlassMaterial();
      const bottomEdge = new THREE.Mesh(bottomEdgeGeometry, bottomEdgeMaterial);
      bottomEdge.position.y = -1.1;
      bottomEdge.rotation.x = Math.PI / 2;
      jarGroup.add(bottomEdge);
      
      // Hide loading message
      document.getElementById('loading').style.display = 'none';
    }
    
    // Create realistic coins
    function createCoin(value, position, rotation) {
      const coinGroup = new THREE.Group();
      
      // Coin body (cylinder)
      const coinGeometry = new THREE.CylinderGeometry(0.2, 0.2, 0.03, 32);
      const coinMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        metalness: 0.9,
        roughness: 0.1
      });
      const coin = new THREE.Mesh(coinGeometry, coinMaterial);
      coin.castShadow = true;
      coinGroup.add(coin);
      
      // Add coin details (texture would be better, but we'll use geometry)
      const detailGeometry = new THREE.TorusGeometry(0.18, 0.01, 8, 32);
      const detailMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffd700,
        metalness: 0.9,
        roughness: 0.1
      });
      const detail = new THREE.Mesh(detailGeometry, detailMaterial);
      detail.rotation.x = Math.PI / 2;
      coinGroup.add(detail);
      
      // Position and rotate the coin
      coinGroup.position.copy(position);
      coinGroup.rotation.copy(rotation);
      
      // Add animation properties
      coinGroup.userData = {
        velocity: new THREE.Vector3(0, -0.01, 0),
        rotationSpeed: new THREE.Vector3(
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01,
          Math.random() * 0.02 - 0.01
        ),
        isFalling: true,
        hasLanded: false,
        landingY: -0.8 + Math.random() * 0.5,
        bounceCount: 0,
        maxBounces: 3
      };
      
      return coinGroup;
    }
    
    // Create realistic dollar bills
    function createBill(position, rotation) {
      const billGroup = new THREE.Group();
      
      // Bill body (box with slight curve)
      const billGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.4);
      const billMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x85bb65,
        metalness: 0.1,
        roughness: 0.8
      });
      const bill = new THREE.Mesh(billGeometry, billMaterial);
      bill.castShadow = true;
      billGroup.add(bill);
      
      // Add bill details (simplified)
      const detailGeometry = new THREE.PlaneGeometry(0.7, 0.3);
      const detailMaterial = new THREE.MeshBasicMaterial({
        color: 0x85bb65,
        side: THREE.DoubleSide
      });
      const detail = new THREE.Mesh(detailGeometry, detailMaterial);
      detail.position.y = 0.011;
      billGroup.add(detail);
      
      // Position and rotate the bill
      billGroup.position.copy(position);
      billGroup.rotation.copy(rotation);
      
      // Add animation properties
      billGroup.userData = {
        velocity: new THREE.Vector3(0, -0.008, 0),
        rotationSpeed: new THREE.Vector3(
          Math.random() * 0.01 - 0.005,
          Math.random() * 0.01 - 0.005,
          Math.random() * 0.01 - 0.005
        ),
        isFalling: true,
        hasLanded: false,
        landingY: -0.9 + Math.random() * 0.6,
        bounceCount: 0,
        maxBounces: 2
      };
      
      return billGroup;
    }
    
    // Function to add money to the jar
    function addMoneyToJar() {
      // Add several coins at different positions
      const coinValues = [1, 5, 10, 25, 50];
      for (let i = 0; i < 15; i++) {
        const value = coinValues[Math.floor(Math.random() * coinValues.length)];
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.7;
        const position = new THREE.Vector3(
          Math.cos(angle) * radius,
          2 + Math.random() * 0.5, // Start above the jar
          Math.sin(angle) * radius
        );
        const rotation = new THREE.Euler(
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI
        );
        
        const coin = createCoin(value, position, rotation);
        jarGroup.add(coin);
        
      }
      
      // Add some dollar bills
      const billValues = [1, 5, 10, 20, 50, 100];
      for (let i = 0; i < 8; i++) {
        const value = billValues[Math.floor(Math.random() * billValues.length)];
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 0.6;
        const position = new THREE.Vector3(
          Math.cos(angle) * radius,
          2 + Math.random() * 0.5, // Start above the jar
          Math.sin(angle) * radius
        );
        const rotation = new THREE.Euler(
          0,
          Math.random() * Math.PI,
          Math.random() * Math.PI / 4
        );
        
        const bill = createBill(position, rotation);
        jarGroup.add(bill);
      }
    }
    
    // Add a subtle animation
    function animate() {
      requestAnimationFrame(animate);
      
      // Rotate the jar slightly
      jarGroup.rotation.y += 0.003;
      
      // Animate coins and bills with gravity simulation
      jarGroup.children.forEach((child, index) => {
        // Skip the jar components (first 4 items)
        if (index > 3) {
          const userData = child.userData;
          
          if (userData.isFalling) {
            // Apply gravity
            child.position.y += userData.velocity.y;
            
            // Apply rotation
            child.rotation.x += userData.rotationSpeed.x;
            child.rotation.y += userData.rotationSpeed.y;
            child.rotation.z += userData.rotationSpeed.z;
            
            // Check if landed
            if (child.position.y <= userData.landingY) {
              if (userData.bounceCount < userData.maxBounces) {
                // Bounce
                userData.velocity.y = -userData.velocity.y * 0.5;
                userData.bounceCount++;
              } else {
                // Stop falling
                userData.isFalling = false;
                userData.hasLanded = true;
                child.position.y = userData.landingY;
                
                // Slow down rotation
                userData.rotationSpeed.x *= 0.5;
                userData.rotationSpeed.y *= 0.5;
                userData.rotationSpeed.z *= 0.5;
              }
            }
          } else if (userData.hasLanded) {
            // Continue slow rotation after landing
            child.rotation.y += 0.002;
          }
        }
      });
      
      controls.update();
      renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Start the animation
    animate();
  </script>
</body>
</html>
`;

// Simple fallback component for when WebView rendering fails
const FallbackComponent = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.fallbackText}>
        Unable to load 3D model
      </Text>
      <Text style={styles.fallbackSubtext}>
        Please check your device compatibility
      </Text>
    </View>
  );
};

const WebViewMoneyJar = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isLoading, setIsLoading] = useState(true);
  const [webViewError, setWebViewError] = useState(false);
  
  useEffect(() => {
    // Handle dimension changes
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  // If there's a WebView error, show the fallback component
  if (webViewError) {
    return <FallbackComponent />;
  }
  
  return (
    <View style={styles.container}>
      {isLoading && <Text style={styles.loadingText}>Loading 3D Jar...</Text>}
      
      <WebView
        style={styles.webview}
        source={{ html: getWebViewContent() }}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.error('WebView error:', nativeEvent);
          setWebViewError(true);
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        scalesPageToFit={true}
        allowsFullscreenVideo={false}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        onLoadEnd={() => setIsLoading(false)}
        originWhitelist={['*']}
        mixedContentMode="always"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webview: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
  },
  fallbackText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
  fallbackSubtext: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 5,
    color: '#999',
  },
});

export default WebViewMoneyJar; 
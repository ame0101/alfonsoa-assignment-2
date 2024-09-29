import React, { useState, useEffect } from 'react';
import { KMeans } from './KMeans';
import Visualization from './Visualization';
import './styles.css';


function App() {
  const [kValue, setKValue] = useState(3);
  const [initMethod, setInitMethod] = useState('random');
  const [data, setData] = useState([]);
  const [centroids, setCentroids] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [kmeans, setKmeans] = useState(null);
  const [manualMode, setManualMode] = useState(false);

  useEffect(() => {
    generateNewDataset();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      initializeKMeans();
    }
  }, [kValue, initMethod, data]);

  const generateNewDataset = () => {
    const newData = Array.from({ length: 200 }, () => [
      Math.random() * 100,
      Math.random() * 100
    ]);
    setData(newData);
  };

  const initializeKMeans = () => {
    const newKmeans = new KMeans(kValue, initMethod);
    newKmeans.setData(data);
    setKmeans(newKmeans);
    setCentroids(newKmeans.getCentroids());
    setClusters(newKmeans.getClusters());
    setManualMode(initMethod === 'manual');
  };

  const stepThroughKMeans = () => {
    if (kmeans) {
      const hasNextStep = kmeans.runStep();
      setCentroids(kmeans.getCentroids());
      setClusters(kmeans.getClusters());
      if (!hasNextStep) {
        alert('KMeans has converged!');
      }
    }
  };

  const runToConvergence = () => {
    if (kmeans) {
      const iterations = kmeans.runToConvergence();
      setCentroids(kmeans.getCentroids());
      setClusters(kmeans.getClusters());
      alert(`KMeans converged in ${iterations} iterations.`);
    }
  };

  const resetAlgorithm = () => {
    initializeKMeans();
  };

  const handleManualCentroidSelection = (point) => {
    if (manualMode && centroids.length < kValue) {
      const newCentroids = [...centroids, point];
      setCentroids(newCentroids);
      if (newCentroids.length === kValue) {
        kmeans.setManualCentroids(newCentroids);
        setManualMode(false);
      }
    }
  };

  return (
    <div className="App">
      <h1>KMeans Clustering Visualization</h1>
      <div>
        <label>
          Number of Clusters (k):
          <input 
            type="number" 
            value={kValue} 
            onChange={(e) => setKValue(parseInt(e.target.value))}
            min="1"
          />
        </label>
      </div>
      <div>
        <label>
          Initialization Method:
          <select value={initMethod} onChange={(e) => setInitMethod(e.target.value)}>
            <option value="random">Random</option>
            <option value="farthestFirst">Farthest First</option>
            <option value="kmeanspp">KMeans++</option>
            <option value="manual">Manual</option>
          </select>
        </label>
      </div>
      <button onClick={generateNewDataset}>Generate New Dataset</button>
      <button onClick={stepThroughKMeans} disabled={manualMode}>Step Through KMeans</button>
      <button onClick={runToConvergence} disabled={manualMode}>Run to Convergence</button>
      <button onClick={resetAlgorithm}>Reset Algorithm</button>
      <Visualization 
        data={data} 
        centroids={centroids} 
        clusters={clusters} 
        manualMode={manualMode}
        onPointClick={handleManualCentroidSelection}
      />
      {manualMode && (
        <p>Click on the plot to select initial centroids. {kValue - centroids.length} more needed.</p>
      )}
    </div>
  );
}

export default App;
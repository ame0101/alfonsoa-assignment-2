export class KMeans {
  constructor(k, initMethod) {
    this.k = k;
    this.initMethod = initMethod;
    this.data = [];
    this.centroids = [];
    this.clusters = [];
    this.converged = false;
  }

  setData(data) {
    this.data = data;
    this.initializeCentroids();
  }

  initializeCentroids() {
    switch (this.initMethod) {
      case 'random':
        this.initializeRandomCentroids();
        break;
      case 'farthestFirst':
        this.initializeFarthestFirst();
        break;
      case 'kmeanspp':
        this.initializeKMeansPlusPlus();
        break;
      case 'manual':
        // Manual initialization is handled separately
        break;
      default:
        this.initializeRandomCentroids();
    }
  }

  initializeRandomCentroids() {
    this.centroids = [];
    for (let i = 0; i < this.k; i++) {
      const randomIndex = Math.floor(Math.random() * this.data.length);
      this.centroids.push([...this.data[randomIndex]]);
    }
  }

  initializeFarthestFirst() {
    this.centroids = [this.data[Math.floor(Math.random() * this.data.length)]];
    
    while (this.centroids.length < this.k) {
      let maxDistance = -1;
      let farthestPoint = null;
      
      for (const point of this.data) {
        const minDistance = Math.min(...this.centroids.map(centroid => this.distance(point, centroid)));
        if (minDistance > maxDistance) {
          maxDistance = minDistance;
          farthestPoint = point;
        }
      }
      
      this.centroids.push([...farthestPoint]);
    }
  }

  initializeKMeansPlusPlus() {
    this.centroids = [this.data[Math.floor(Math.random() * this.data.length)]];
    
    while (this.centroids.length < this.k) {
      const distances = this.data.map(point => 
        Math.min(...this.centroids.map(centroid => this.distance(point, centroid)))
      );
      const sumDistances = distances.reduce((a, b) => a + b, 0);
      const probabilities = distances.map(d => d / sumDistances);
      
      let cumulativeProbability = 0;
      const random = Math.random();
      for (let i = 0; i < this.data.length; i++) {
        cumulativeProbability += probabilities[i];
        if (cumulativeProbability > random) {
          this.centroids.push([...this.data[i]]);
          break;
        }
      }
    }
  }

  distance(point1, point2) {
    return Math.sqrt(point1.reduce((sum, value, index) => sum + Math.pow(value - point2[index], 2), 0));
  }

  assignPointsToClusters() {
    this.clusters = this.centroids.map(() => []);
    
    for (const point of this.data) {
      let minDistance = Infinity;
      let closestCentroidIndex = 0;
      
      for (let i = 0; i < this.centroids.length; i++) {
        const distance = this.distance(point, this.centroids[i]);
        if (distance < minDistance) {
          minDistance = distance;
          closestCentroidIndex = i;
        }
      }
      
      this.clusters[closestCentroidIndex].push(point);
    }
  }

  updateCentroids() {
    const newCentroids = this.clusters.map(cluster => {
      if (cluster.length === 0) return null;
      const sum = cluster.reduce((acc, point) => point.map((value, index) => acc[index] + value));
      return sum.map(value => value / cluster.length);
    });
    
    this.converged = newCentroids.every((centroid, index) => 
      centroid === null || this.distance(centroid, this.centroids[index]) < 0.001
    );
    
    this.centroids = newCentroids.map((centroid, index) => 
      centroid === null ? this.getRandomPoint() : centroid
    );
  }

  getRandomPoint() {
    return [...this.data[Math.floor(Math.random() * this.data.length)]];
  }

  runStep() {
    if (this.converged) return false;
    this.assignPointsToClusters();
    this.updateCentroids();
    return !this.converged;
  }

  runToConvergence(maxIterations = 100) {
    let iterations = 0;
    while (!this.converged && iterations < maxIterations) {
      this.runStep();
      iterations++;
    }
    return iterations;
  }

  getCentroids() {
    return this.centroids;
  }

  getClusters() {
    return this.clusters;
  }

  setManualCentroids(manualCentroids) {
    this.centroids = manualCentroids;
    this.initMethod = 'manual';
  }
}
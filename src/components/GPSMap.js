import React, { Component } from 'react';

class GPSMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
    this.state = {
      points: [],
      currentIndex: 0,
    };
  }

  componentDidMount() {
    this.plotGPSData();
    if (this.props.isDrawing) {
      requestAnimationFrame(this.animatePoints);
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isDrawing !== this.props.isDrawing) {
      if (this.props.isDrawing) {
        requestAnimationFrame(this.animatePoints);
      } else {
        cancelAnimationFrame(this.requestID);
      }
    }
  }

  getLatLongBounds(points) {
    let minLat = Infinity;
    let maxLat = -Infinity;
    let minLong = Infinity;
    let maxLong = -Infinity;

    points.forEach(point => {
      const data = point.split(',');
      const lat = parseFloat(data[2]);
      const long = parseFloat(data[4]);
      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLong = Math.min(minLong, long);
      maxLong = Math.max(maxLong, long);
    });

    return { minLat, maxLat, minLong, maxLong };
  }

  animatePoints = () => {
    // handle when canvas is not ready
    if (!this.mapRef.current) {
      this.requestID = requestAnimationFrame(this.animatePoints);
      return;
    }
  
    const { currentIndex, points } = this.state;
    const ctx = this.mapRef.current.getContext('2d');
    const scale = 10000;
  
    const { minLat, maxLat, minLong, maxLong } = this.getLatLongBounds(points);
    const latCenter = (minLat + maxLat) / 2;
    const longCenter = (minLong + maxLong) / 2;
  
    const data = points[currentIndex].split(',');
    const lat = parseFloat(data[2]);
    const lng = parseFloat(data[4]);
    const centerX = ctx.canvas.width / 2;
    const centerY = ctx.canvas.height / 2;
  
    const xOffset = centerX - longCenter * scale;
    const yOffset = centerY - latCenter * scale;
  
    const rectSize = 10;
    const rectX = (lng * scale) + xOffset;
    const rectY = (lat * scale) + yOffset;
  
    // Clear previous rectangle
    if (currentIndex > 0) {
      const prevData = points[currentIndex - 1].split(',');
      const prevLat = parseFloat(prevData[2]);
      const prevLng = parseFloat(prevData[4]);
      const prevRectX = prevLng * scale + xOffset;
      const prevRectY = prevLat * scale + yOffset;
      ctx.clearRect(
        prevRectX - rectSize / 2,
        prevRectY - rectSize / 2,
        rectSize,
        rectSize
      );
    }
  
    // Draw rectangle
    ctx.fillStyle = 'steelblue';
    ctx.fillRect(rectX - rectSize / 2, rectY - rectSize / 2, rectSize, rectSize);
  
    // Draw black lines
    if (currentIndex === 0) {
      ctx.beginPath();
      ctx.moveTo(rectX, rectY);
    } else {
      ctx.lineTo(rectX, rectY);
      ctx.stroke();
    }
  
    if (currentIndex < points.length - 1) {
      setTimeout(() => {
        this.setState({ currentIndex: currentIndex + 1 });
        if (this.props.isDrawing) {
          this.requestID = requestAnimationFrame(this.animatePoints);
        }
      }, 500); // Change this value to adjust the delay between points
    }
  };

  plotGPSData() {
    this.setState({ points: this.props.data["gps"] });
  }

  render() {
    return <canvas ref={this.mapRef} width={400} height={400} />;
  }
}

export default GPSMap;
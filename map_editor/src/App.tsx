import React, { useState, useEffect, useRef } from 'react';
import './App.css';

interface MapLayer {
  name: string;
  data: number[];
}

interface GameMap {
  id: string;
  name: string;
  width: number;
  height: number;
  tileSize: number;
  layers: MapLayer[];
}

const API_SERVER = "http://localhost:8080/api/maps";
const TILE_SIZE = 50;

function App() {
  const [mapList, setMapList] = useState<any[]>([]);
  const [editingMap, setEditingMap] = useState<GameMap | null>(null);

  // Controls
  const [currentTile, setCurrentTile] = useState<number>(1);
  const [currentLayer, setCurrentLayer] = useState<number>(1); // Index: 0 = bg, 1 = col
  const [isDrawMode, setIsDrawMode] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load Map List on startup
  useEffect(() => {
    fetchMaps();
  }, []);

  const fetchMaps = async () => {
    try {
      const resp = await fetch(API_SERVER);
      const data = await resp.json();
      setMapList(data);
    } catch (err) {
      console.error("Failed to load map list", err);
    }
  };

  const loadMap = async (id: string) => {
    try {
      const resp = await fetch(`${API_SERVER}/${id}`);
      const data = await resp.json();
      setEditingMap(data);
    } catch (err) {
      console.error("Failed to load map", err);
    }
  };

  const createNewMap = () => {
    const width = 20;
    const height = 15;
    const newMap: GameMap = {
      id: "zone_" + Date.now(),
      name: "New Zone",
      width,
      height,
      tileSize: TILE_SIZE,
      layers: [
        { name: "background", data: new Array(width * height).fill(0) },
        { name: "collision", data: new Array(width * height).fill(0) }
      ]
    };
    setEditingMap(newMap);
  };

  const saveMapToServer = async () => {
    if (!editingMap) return;
    try {
      await fetch(API_SERVER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingMap)
      });
      alert("Map saved successfully!");
      fetchMaps();
    } catch (err) {
      console.error("Failed to save map", err);
      alert("Failed to save map");
    }
  };

  // Canvas Drawing
  useEffect(() => {
    if (!editingMap || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const w = editingMap.width * editingMap.tileSize;
    const h = editingMap.height * editingMap.tileSize;
    canvasRef.current.width = w;
    canvasRef.current.height = h;

    // Clear
    ctx.fillStyle = '#111b2b';
    ctx.fillRect(0, 0, w, h);

    // Draw Grid
    ctx.strokeStyle = '#2a3b5c';
    ctx.lineWidth = 1;
    for (let i = 0; i <= editingMap.width; i++) {
      ctx.beginPath();
      ctx.moveTo(i * editingMap.tileSize, 0);
      ctx.lineTo(i * editingMap.tileSize, h);
      ctx.stroke();
    }
    for (let j = 0; j <= editingMap.height; j++) {
      ctx.beginPath();
      ctx.moveTo(0, j * editingMap.tileSize);
      ctx.lineTo(w, j * editingMap.tileSize);
      ctx.stroke();
    }

    const collisionColor = 'rgba(255, 51, 102, 0.5)'; // neo-red logic

    // Draw Map Data
    for (let layerIdx = 0; layerIdx < editingMap.layers.length; layerIdx++) {
      const layer = editingMap.layers[layerIdx];
      for (let i = 0; i < layer.data.length; i++) {
        const tileVal = layer.data[i];
        if (tileVal === 0) continue; // Empty

        const x = (i % editingMap.width) * editingMap.tileSize;
        const y = Math.floor(i / editingMap.width) * editingMap.tileSize;

        if (layer.name === "collision" && tileVal === 1) {
          ctx.fillStyle = collisionColor;
          ctx.fillRect(x, y, editingMap.tileSize, editingMap.tileSize);
          // Draw X to indicate obstacle
          ctx.strokeStyle = 'white';
          ctx.beginPath();
          ctx.moveTo(x, y); ctx.lineTo(x + editingMap.tileSize, y + editingMap.tileSize);
          ctx.moveTo(x + editingMap.tileSize, y); ctx.lineTo(x, y + editingMap.tileSize);
          ctx.stroke();
        } else if (layer.name === "background" && tileVal === 2) {
          ctx.fillStyle = '#00f0ff'; // Neon floor
          ctx.fillRect(x, y, editingMap.tileSize, editingMap.tileSize);
        }
      }
    }
  }, [editingMap]);

  // Handle Paint
  const handleCanvasInteraction = (e: React.MouseEvent | React.TouchEvent, isClicking: boolean) => {
    if (!editingMap || (!isDrawMode && !isClicking)) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const gridX = Math.floor(x / editingMap.tileSize);
    const gridY = Math.floor(y / editingMap.tileSize);

    if (gridX >= 0 && gridX < editingMap.width && gridY >= 0 && gridY < editingMap.height) {
      const index = gridY * editingMap.width + gridX;

      const newMap = { ...editingMap };
      newMap.layers[currentLayer].data[index] = currentTile;
      setEditingMap(newMap);
    }
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Map Manager</h2>
        <button onClick={createNewMap} className="btn-primary">Create New Map</button>
        <div className="map-list">
          {mapList.map(m => (
            <div key={m.id} className="map-item">
              <span>{m.name}</span>
              <button className="btn-small" onClick={() => loadMap(m.id)}>Load</button>
            </div>
          ))}
        </div>

        {editingMap && (
          <div className="editor-tools">
            <hr />
            <h3>Map Settings</h3>
            <label>Name: <input value={editingMap.name} onChange={e => setEditingMap({ ...editingMap, name: e.target.value })} /></label>
            <label>Width: <input type="number" value={editingMap.width} onChange={e => setEditingMap({ ...editingMap, width: parseInt(e.target.value) })} /></label>
            <label>Height: <input type="number" value={editingMap.height} onChange={e => setEditingMap({ ...editingMap, height: parseInt(e.target.value) })} /></label>

            <h3>Paint Settings</h3>
            <label>Current Layer
              <select onChange={e => setCurrentLayer(parseInt(e.target.value))} value={currentLayer}>
                <option value={0}>Background (Visuals)</option>
                <option value={1}>Collision (Walls)</option>
              </select>
            </label>

            <label>Brush Tile
              <select onChange={e => setCurrentTile(parseInt(e.target.value))} value={currentTile}>
                <option value={0}>Erase (0)</option>
                <option value={1}>Wall / Collision (1)</option>
                <option value={2}>Neon Floor (2)</option>
              </select>
            </label>

            <button onClick={saveMapToServer} className="btn-success">SAVE MAP TO SERVER</button>
          </div>
        )}
      </div>

      <div className="main-area">
        {!editingMap && (
          <div className="empty-state">Select or Create a Map</div>
        )}
        {editingMap && (
          <div className="canvas-wrapper">
            <canvas
              ref={canvasRef}
              onMouseDown={(e) => { setIsDrawMode(true); handleCanvasInteraction(e, true); }}
              onMouseMove={(e) => handleCanvasInteraction(e, false)}
              onMouseUp={() => setIsDrawMode(false)}
              onMouseLeave={() => setIsDrawMode(false)}
              onTouchStart={(e) => { setIsDrawMode(true); handleCanvasInteraction(e, true); }}
              onTouchMove={(e) => handleCanvasInteraction(e, false)}
              onTouchEnd={() => setIsDrawMode(false)}
              style={{ border: "2px solid #00f0ff", cursor: 'crosshair', userSelect: 'none' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

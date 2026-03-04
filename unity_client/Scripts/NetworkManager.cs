using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Net.WebSockets;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;

[Serializable]
public class Vector2Data {
    public float x;
    public float y;
}

[Serializable]
public class PlayerState {
    public string id;
    public string name;
    public Vector2Data position;
    public int hp;
    public int ep;
    public int level;
}

[Serializable]
public class InitStatePayload {
    public PlayerState me;
    public List<PlayerState> others;
}

[Serializable]
public class PlayerMovedPayload {
    public string id;
    public Vector2Data position;
}

[Serializable]
public class PlayerLeftPayload {
    public string id;
}

[Serializable]
public class WrapperMessage {
    public string type;
    // We cannot use object or dynamic in JsonUtility. 
    // We will parse the raw JSON again with specific types inside ProcessMessage using a little string manipulation or dummy classes.
}

public class NetworkManager : MonoBehaviour
{
    [SerializeField] private string serverUrl = "ws://localhost:8080";
    private string playerName;

    private ClientWebSocket ws;
    private CancellationTokenSource cts;
    
    private ConcurrentQueue<Action> mainThreadActions = new ConcurrentQueue<Action>();

    public async void ConnectToServer(string pName)
    {
        playerName = pName;
        ws = new ClientWebSocket();
        cts = new CancellationTokenSource();

        try
        {
            await ws.ConnectAsync(new Uri(serverUrl), cts.Token);
            Debug.Log("Connected to Server!");

            _ = ReceiveLoop();

            // Send JOIN message
            string joinPayload = $"{{\"name\":\"{playerName}\"}}";
            await SendMessageAsync("JOIN", joinPayload);
        }
        catch (Exception e)
        {
            Debug.LogError($"Connection error: {e.Message}");
        }
    }

    void Update()
    {
        while (mainThreadActions.TryDequeue(out var action))
        {
            action?.Invoke();
        }
    }

    private async Task ReceiveLoop()
    {
        var buffer = new byte[8192];

        while (ws.State == WebSocketState.Open)
        {
            try
            {
                var result = await ws.ReceiveAsync(new ArraySegment<byte>(buffer), cts.Token);
                if (result.MessageType == WebSocketMessageType.Close)
                {
                    await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, string.Empty, CancellationToken.None);
                    Debug.Log("WebSocket closed by server.");
                }
                else
                {
                    string message = Encoding.UTF8.GetString(buffer, 0, result.Count);
                    ProcessMessage(message);
                }
            }
            catch (Exception ex)
            {
                Debug.LogError($"WebSocket receive error: {ex.Message}");
                break;
            }
        }
    }

    private void ProcessMessage(string json)
    {
        try 
        {
            // Simple string extraction since JsonUtility doesn't natively extract dynamic nested objects easily
            WrapperMessage wrapper = JsonUtility.FromJson<WrapperMessage>(json);
            
            // Extract the payload substring manually for nested parsing
            int payloadIndex = json.IndexOf("\"payload\":");
            if (payloadIndex == -1) return;
            
            // Find start of payload object
            int startIndex = json.IndexOf("{", payloadIndex);
            int arrayStartIndex = json.IndexOf("[", payloadIndex); // for arrays if any
            
            // Just cheating around JsonUtility limits by parsing the whole json wrapper and matching the structure 
            // Better approach for Unity without Newtonsoft: Wrap everything in a big master class
            MasterMessage master = JsonUtility.FromJson<MasterMessage>(json);

            mainThreadActions.Enqueue(() => {
                switch (wrapper.type)
                {
                    case "INIT_STATE":
                        if (master.payload != null && master.payload.me != null)
                        {
                            GameManager.Instance.OnConnectedAndStateReceived(master.payload.me.id, master.payload.me.position);
                            if (master.payload.others != null)
                            {
                                foreach(var p in master.payload.others)
                                {
                                    GameManager.Instance.SpawnPlayer(p.id, p.position.x, p.position.y, false);
                                }
                            }
                        }
                        break;
                    case "PLAYER_JOINED":
                        if (master.payload != null && master.payload.id != null)
                        {
                            GameManager.Instance.SpawnPlayer(master.payload.id, master.payload.position.x, master.payload.position.y, false);
                        }
                        break;
                    case "PLAYER_MOVED":
                        if (master.payload != null && master.payload.id != null)
                        {
                            GameManager.Instance.UpdatePlayerPosition(master.payload.id, master.payload.position.x, master.payload.position.y);
                        }
                        break;
                    case "PLAYER_LEFT":
                        if (master.payload != null && master.payload.id != null)
                        {
                            GameManager.Instance.RemovePlayer(master.payload.id);
                        }
                        break;
                }
            });
        }
        catch (Exception e)
        {
            Debug.LogError($"Error parsing message: {e.Message}\nPayload: {json}");
        }
    }

    public async Task SendMessageAsync(string type, string payloadJson)
    {
        if (ws == null || ws.State != WebSocketState.Open) return;

        string fullJson = $"{{\"type\":\"{type}\", \"payload\": {payloadJson}}}";
        var bytes = Encoding.UTF8.GetBytes(fullJson);
        
        await ws.SendAsync(new ArraySegment<byte>(bytes), WebSocketMessageType.Text, true, cts.Token);
    }

    public void SendMove(float x, float y)
    {
        string payload = $"{{\"x\":{x}, \"y\":{y}}}";
        _ = SendMessageAsync("MOVE", payload);
    }

    private async void OnDestroy()
    {
        if (ws != null)
        {
            cts.Cancel();
            if (ws.State == WebSocketState.Open)
            {
                await ws.CloseAsync(WebSocketCloseStatus.NormalClosure, "Client disconnecting", CancellationToken.None);
            }
            ws.Dispose();
        }
    }
}

// Huge workaround class because Unity JsonUtility needs precise matching paths
[Serializable]
public class MasterMessage {
    public string type;
    public MasterPayload payload;
}

[Serializable]
public class MasterPayload {
    // fields for INIT_STATE
    public PlayerState me;
    public List<PlayerState> others;
    
    // fields for incoming state (PLAYER_JOINED, PLAYER_MOVED, PLAYER_LEFT use these)
    public string id;
    public string name;
    public Vector2Data position;
    public int hp;
    public int ep;
    public int level;
    public string message; // SERVER_FULL
}

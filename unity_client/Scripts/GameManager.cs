using System.Collections.Generic;
using UnityEngine;
using TMPro; // Assuming TextMeshPro is used for UI
using UnityEngine.UI;

public class GameManager : MonoBehaviour
{
    public static GameManager Instance { get; private set; }

    [Header("Network")]
    public NetworkManager networkManager;

    [Header("UI Panels")]
    public GameObject loginPanel;
    public GameObject gameUIPanel;
    public TMP_InputField nameInput;
    public Button joinButton;

    [Header("Game Objects")]
    public GameObject playerPrefab;
    public GameObject otherPlayerPrefab;
    public Camera mainCamera;

    private Dictionary<string, GameObject> players = new Dictionary<string, GameObject>();
    private string myId;
    public float moveSpeed = 5f;

    // Movement state
    private bool isAutoMoving = false;
    private Vector2 targetPosition;

    private void Awake()
    {
        if (Instance == null) Instance = this;
        else Destroy(gameObject);
    }

    private void Start()
    {
        // Setup UI
        loginPanel.SetActive(true);
        gameUIPanel.SetActive(false);

        joinButton.onClick.AddListener(OnJoinClicked);
    }

    private void OnJoinClicked()
    {
        string pName = nameInput.text.Trim();
        if (string.IsNullOrEmpty(pName)) return;

        loginPanel.SetActive(false);
        networkManager.ConnectToServer(pName);
    }

    private void Update()
    {
        if (string.IsNullOrEmpty(myId) || !players.ContainsKey(myId)) return;

        HandleInput();
        UpdateCamera();
    }

    private void HandleInput()
    {
        GameObject me = players[myId];
        Vector3 pos = me.transform.position;
        float dx = 0;
        float dy = 0;

        // Keyboard Input (WASD or Arrows)
        if (Input.GetKey(KeyCode.W) || Input.GetKey(KeyCode.UpArrow)) dy += 1;
        if (Input.GetKey(KeyCode.S) || Input.GetKey(KeyCode.DownArrow)) dy -= 1;
        if (Input.GetKey(KeyCode.A) || Input.GetKey(KeyCode.LeftArrow)) dx -= 1;
        if (Input.GetKey(KeyCode.D) || Input.GetKey(KeyCode.RightArrow)) dx += 1;

        if (dx != 0 || dy != 0)
        {
            isAutoMoving = false; // Override auto moving
            pos.x += dx * moveSpeed * Time.deltaTime;
            pos.y += dy * moveSpeed * Time.deltaTime;
            me.transform.position = pos;
            networkManager.SendMove(pos.x, pos.y);
        }
        else if (Input.GetMouseButtonDown(1)) // Right click
        {
            Vector3 worldPoint = mainCamera.ScreenToWorldPoint(Input.mousePosition);
            targetPosition = new Vector2(worldPoint.x, worldPoint.y);
            isAutoMoving = true;
        }

        // Handle Auto Movement (Click to move)
        if (isAutoMoving && dx == 0 && dy == 0)
        {
            Vector2 currentPos = new Vector2(pos.x, pos.y);
            float dist = Vector2.Distance(currentPos, targetPosition);
            
            if (dist > 0.1f)
            {
                pos = Vector2.MoveTowards(currentPos, targetPosition, moveSpeed * Time.deltaTime);
                me.transform.position = pos;
                networkManager.SendMove(pos.x, pos.y);
            }
            else
            {
                isAutoMoving = false;
            }
        }
    }

    private void UpdateCamera()
    {
        if (players.TryGetValue(myId, out GameObject me))
        {
            Vector3 camPos = mainCamera.transform.position;
            camPos.x = me.transform.position.x;
            camPos.y = me.transform.position.y;
            mainCamera.transform.position = camPos;
        }
    }

    // --- Called by NetworkManager via Main Thread Queue ---

    public void OnConnectedAndStateReceived(string id, Vector2Data pos)
    {
        myId = id;
        gameUIPanel.SetActive(true);

        SpawnPlayer(id, pos.x, pos.y, true);
    }

    public void SpawnPlayer(string id, float x, float y, bool isMe = false)
    {
        if (players.ContainsKey(id)) return;

        GameObject prefab = isMe ? playerPrefab : otherPlayerPrefab;
        // Fallback if no prefabs assigned
        if (prefab == null)
        {
            prefab = GameObject.CreatePrimitive(PrimitiveType.Sphere);
            // Destroy the 3D collider, add 2D if needed in real project
            Destroy(prefab.GetComponent<Collider>());
            if (isMe) prefab.GetComponent<Renderer>().material.color = Color.cyan;
            else prefab.GetComponent<Renderer>().material.color = Color.red;
        }

        GameObject obj = Instantiate(prefab, new Vector3(x, y, 0), Quaternion.identity);
        players.Add(id, obj);
    }

    public void UpdatePlayerPosition(string id, float x, float y)
    {
        if (id == myId) return; // Ignore my own move echo

        if (players.TryGetValue(id, out GameObject obj))
        {
            // In a real game, you would LERP this to make it smooth
            obj.transform.position = new Vector3(x, y, 0);
        }
    }

    public void RemovePlayer(string id)
    {
        if (players.TryGetValue(id, out GameObject obj))
        {
            Destroy(obj);
            players.Remove(id);
        }
    }
}

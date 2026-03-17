using UnityEngine;

public class ResourceNode : MonoBehaviour
{
    public enum ResourceType { WoodTree, StoneBoulder, SulfurOre, CrystallizedIronOre }

    [Header("Resource Info")]
    public ResourceType type;
    public float maxDurability = 100f; // Độ bền của khối đất đá/cái cây này
    private float currentDurability;

    [Header("Item Drops")]
    public string itemIdToGive; // Mã ID item sẽ tự cho vào túi hoặc drop ra đất (VD: item_wood, item_stone)
    public int dropAmountPerHit = 2; // Số lượng lượm được trên mỗi cú đập trúng
    public int finalBonusDrop = 10;  // Quà thưởng phá vỡ hoàn toàn

    private void Start()
    {
        currentDurability = maxDurability;
    }

    public void TakeHit(float damage)
    {
        currentDurability -= damage;
        DropResource(dropAmountPerHit);

        // Cục tài nguyên này đã bị khai thác sạch
        if (currentDurability <= 0)
        {
            DropResource(finalBonusDrop); // Rớt nốt những gì còn sót lại
            DestroyNode();
        }
    }

    private void DropResource(int amount)
    {
        // Tương lai sẽ Instantiate (tạo object 3D rơi xuống) hoặc móc vào Inventory người chơi.
        Debug.Log($"[Tương tác 3D] Đập trúng tài nguyên! Thu được {amount} đơn vị {type}.");
    }

    private void DestroyNode()
    {
        Debug.Log($"[Thế giới] Khối {type} đã bị phá hủy hoàn toàn bỏi người chơi.");
        // Gắn cơ chế tự động Respawn sau x phút ở đây.
        Destroy(gameObject);
    }
}

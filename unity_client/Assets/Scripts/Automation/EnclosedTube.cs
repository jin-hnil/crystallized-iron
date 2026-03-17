using UnityEngine;
using System.Collections;
using System.Collections.Generic;
using CrystallizedIron.Inventory;

namespace CrystallizedIron.Automation
{
    // Đại diện cho 1 đoạn Ống hình hộp chữ nhật khép kín vận tải Item.
    // Kết nối Point A và Point B.
    public class EnclosedTube : MonoBehaviour
    {
        [Header("Tube Specs")]
        public float transportSpeed = 5f; // Tốc độ trượt bên trong ống

        [Header("Networking")]
        // Điểm Cắm Đích: Cắm vào Cổng Nhận (Input Port) của cấu trúc tiếp theo, HOẶC Ngã Ba.
        [Header("Delivery Endpoints")]
        public MachinePort destinationPort; 
        public SmartFilter targetFilter;

        private List<TubePayload> itemsInTransit = new List<TubePayload>();

        private class TubePayload
        {
            public ItemData item;
            public int amount;
            public float currentProgress; 
        }

        private void Update()
        {
            for (int i = itemsInTransit.Count - 1; i >= 0; i--)
            {
                TubePayload payload = itemsInTransit[i];
                payload.currentProgress += (transportSpeed * Time.deltaTime) / Vector3.Distance(startPort.position, endPort.position);

                if (payload.currentProgress >= 1f)
                {
                    DeliverToTarget(payload);
                    itemsInTransit.RemoveAt(i);
                }
            }
        }

        public bool InsertItemIntoTube(ItemData itemToInsert, int amount)
        {
            if (itemsInTransit.Count >= 5) 
            {
                return false;
            }

            itemsInTransit.Add(new TubePayload { item = itemToInsert, amount = amount, currentProgress = 0f });
            return true;
        }

        private void DeliverToTarget(TubePayload payload)
        {
            bool success = false;

            if (destinationPort != null)
            {
                // Máy móc sẽ tự phòng vệ nếu như bị cắm nhầm Lỗ Ống. (Đẩy được vào Input thì là True)
                success = destinationPort.ReceiveItem(payload.item, payload.amount);
            }
            else if (targetFilter != null)
            {
                success = targetFilter.RouteItem(payload.item, payload.amount);
            }

            if (!success)
            {
                Debug.LogWarning("[Tube] Bị thắt nút hoặc Điểm Đến từ chối Nhận. Vật phẩm rớt ra nền xưởng!");
            }
        }
    }
}

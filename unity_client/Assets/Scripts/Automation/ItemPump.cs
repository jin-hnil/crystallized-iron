using UnityEngine;
using System.Collections.Generic;
using CrystallizedIron.Inventory;
using CrystallizedIron.Building;
using CrystallizedIron.Automation.Signals; // Import thư viện mạch điện

namespace CrystallizedIron.Automation
{
    public enum PumpOperation
    {
        StandardExtractor, 
        SmartFilter,       
        OverflowRelease    
    }

    public class ItemPump : MonoBehaviour
    {
        [Header("Networking")]
        public MachinePort sourcePort; 
        public EnclosedTube outputTube; 

        [Header("Operation Mode")]
        public PumpOperation pumpMode = PumpOperation.StandardExtractor;
        public float pumpInterval = 1.0f; 
        public int amountPerPump = 1;

        [Header("Smart Extraction Filter (Mở nếu là SmartFilter)")]
        public List<ItemData> filterList = new List<ItemData>(); 
        public bool isWhitelist = true; 

        [Header("Overflow Settings (Mở nếu là OverflowRelease)")]
        public float triggerFillPercentage = 0.8f; 

        [Header("Logic Network Control (Optional)")]
        // Dây mạng Tín Hiệu (Tùy chọn)
        public SignalReceiver signalReceiver;

        [Header("Power Grid Demand")]
        // Nhu cầu Cắn điện của Máy Bơm
        public Power.PowerConsumer powerConsumer;

        private float timer = 0f;

        private void Update()
        {
            if (sourcePort == null || outputTube == null) return;

            // KIỂM TRA ĐIỀU KIỆN TÍN HIỆU MẠCH ĐIỆN
            if (signalReceiver != null && !signalReceiver.IsConditionMet())
            {
                // Bị ngắt tín hiệu -> Coi như Máy Khép cửa (Ngủ đông idle, ít cắn điện)
                if(powerConsumer != null) powerConsumer.SetWorkingState(false);
                return;
            }

            // ÉP KIỂM DUYỆT ĐIỆN NĂNG THỰC TẾ
            float operatingDripSpeedMultiplier = 1f;

            if (powerConsumer != null)
            {
                // Đánh động Rằng "Tao đang cần điện Tải Đỉnh để cày cuốc"
                powerConsumer.SetWorkingState(true);

                // Đi hỏi Tổng Đài xem Mạng điện giờ có Cúp Điện hay Yếu bình không?
                operatingDripSpeedMultiplier = powerConsumer.GetOperatingEffectiveness();
                
                // Nếu Bị BLACKOUT (Cắt điện 100%) -> Máy đứng yên, Chết lâm sàng 
                if (operatingDripSpeedMultiplier <= 0f) return;
            }

            // Gắn Hệ Số Điện vào thời gian bơm.
            // Nếu điện đủ 100% -> `operatingDripSpeedMultiplier` = 1 => Bơm chạy Tốc độ thường.
            // Nếu điện chớp tắt Thiếu 40% (Browser Outage) -> `operatingDripSpeedMultiplier` = 0.6 => Thời gian ngâm nhịp Bơm bị kéo chậm lại đáng kể.
            timer += Time.deltaTime * operatingDripSpeedMultiplier;
            
            if (timer >= pumpInterval)
            {
                ExecuteExtraction();
                timer = 0f;
            }
        }

        private void ExecuteExtraction()
        {
            var interactableSlots = sourcePort.GetExtractableSlots();
            if (interactableSlots == null) return; 

            if (pumpMode == PumpOperation.OverflowRelease)
            {
                int usedSlots = 0;
                foreach(var s in interactableSlots) { if (!s.IsEmpty()) usedSlots++; }
                
                float fillRatio = (float)usedSlots / interactableSlots.Count;
                if (fillRatio < triggerFillPercentage) return; 
            }

            for (int i = 0; i < interactableSlots.Count; i++)
            {
                InventorySlot slot = interactableSlots[i];
                if (!slot.IsEmpty())
                {
                    ItemData itemToMove = slot.item;

                    if (pumpMode == PumpOperation.SmartFilter && filterList.Count > 0)
                    {
                        bool isInList = filterList.Contains(itemToMove);
                        if (isWhitelist && !isInList) continue; 
                        if (!isWhitelist && isInList) continue; 
                    }

                    int actualExtractAmount = Mathf.Min(amountPerPump, slot.amount);
                    bool accepted = outputTube.InsertItemIntoTube(itemToMove, actualExtractAmount);
                    
                    if (accepted)
                    {
                        slot.RemoveAmount(actualExtractAmount);
                        break; 
                    }
                }
            }
        }
    }
}

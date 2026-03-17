using UnityEngine;

namespace CrystallizedIron.Automation.Power
{
    // Phụ kiện Nhãn mác Gắn lên Lò nung / Máy bơm... để biến chúng thành cục Tiêu thụ Ăn điện
    public class PowerConsumer : MonoBehaviour
    {
        [Header("Consumption Specs (Watts)")]
        public float activePowerConsumption = 250f; // Watt tiêu thụ lúc đang chạy cày cuốc
        public float idlePowerConsumption = 10f;    // Nửa đêm máy tắt đèn ngủ, vẫn cắn 10Watt để nháy đèn Led

        [Header("Connected Grid")]
        public PowerNetwork connectedGrid;

        private bool machineIsCurrentlyWorking = false;
        private float powerReceivedRatio = 0f; // Do lưới tổng đài cấp phát

        public void LinkToGrid(PowerNetwork grid)
        {
            connectedGrid = grid;
            if (grid != null && !grid.consumers.Contains(this))
                grid.consumers.Add(this);
        }

        // Báo cho lưới điện biết Tôi đang cắn bao nhiêu số điện lúc này
        public float GetCurrentDemand()
        {
            return machineIsCurrentlyWorking ? activePowerConsumption : idlePowerConsumption;
        }

        // Cập nhật trạng thái đang Gồng Máy hay Đang Nghỉ Giải Lao (Script của Máy Bơm sẽ gọi hàm này)
        public void SetWorkingState(bool isWorking)
        {
            machineIsCurrentlyWorking = isWorking;
        }

        // Lưới điện lưới báo về Máy: "Tháng này sụt áp, em bị Cắt giảm chỉ còn 60% điện năng!"
        public void ProvidePower(float ratio)
        {
            powerReceivedRatio = ratio;
        }

        // Lấy Hệ Số Chạy Máy. Nếu = 0 là Rút Chui. Bằng 0.5 là Chạy chậm. Bằng 1 là Ép xung.
        public float GetOperatingEffectiveness()
        {
            return powerReceivedRatio;
        }
    }
}

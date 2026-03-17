using UnityEngine;
using System.Collections.Generic;

namespace CrystallizedIron.Automation.Power
{
    // Quản lý tổng hợp một Lưới Điện (Chứa danh sách Cột điện nối nhau)
    public class PowerNetwork : MonoBehaviour
    {
        public List<PowerGenerator> generators = new List<PowerGenerator>();
        public List<PowerConsumer> consumers = new List<PowerConsumer>();

        // Đo bằng Đơn vị Watt
        public float currentProduction = 0f;
        public float currentDemand = 0f;

        // Tỷ lệ cung cấp điện: 1.0f = Đủ 100%, 0.5f = Thiếu Điện (Brownout, chạy chậm lại phân nửa)
        public float SatisfactionRatio { get; private set; } = 1f;

        private void Update()
        {
            CalculateNetworkGrid();
        }

        private void CalculateNetworkGrid()
        {
            currentProduction = 0f;
            currentDemand = 0f;

            // Gom Tổng Cung
            foreach (var gen in generators)
            {
                if(gen.IsActive) currentProduction += gen.OutputWattage;
            }

            // Gom Tổng Cầu
            foreach (var con in consumers)
            {
                currentDemand += con.GetCurrentDemand();
            }

            // Tính Toán Tỷ lệ Đáp Ứng
            if (currentDemand <= 0) 
            {
                SatisfactionRatio = 1f;
            }
            else if (currentProduction >= currentDemand)
            {
                SatisfactionRatio = 1f; // Điện dư dả, Cung ứng đủ 100%
                // TODO: Lưu lượng điện dư có thể nhồi vào cục Ắc quy (Batteries)
            }
            else
            {
                // THIẾU ĐIỆN: Dẫn đến hiện tượng sụt áp. Chia đều điện cho mọi máy móc.
                // Các máy móc sẽ lấy SatisfactionRatio này để GIẢM TỐC tốc độ bơm/khoan tương ứng.
                SatisfactionRatio = currentProduction / currentDemand;
            }

            // Phân bổ điện lại cho Mọi Cỗ Máy Tiêu Thụ để chúng tự biết mình được chia bao nhiêu "Thức ăn"
            foreach (var con in consumers)
            {
                con.ProvidePower(SatisfactionRatio);
            }
        }
    }
}

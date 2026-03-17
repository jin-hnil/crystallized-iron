using UnityEngine;
using System.Collections.Generic;

namespace CrystallizedIron.Automation.Signals
{
    // Xác định loại Toán tử So Sánh
    public enum LogicOperator
    {
        GreaterThan,    // Lớn hơn (>)
        LessThan,       // Nhỏ hơn (<)
        Equals,         // Bằng (==)
        NotEquals       // Khác (!=)
    }

    // Giá trị Tín hiệu (Ví dụ: Tín hiệu "Gỗ" giá trị 500, Tín hiệu "Đỏ" giá trị 1)
    [System.Serializable]
    public struct SignalData
    {
        public string signalID; // Tên tín hiệu (Ví dụ: "IronOre", "GreenSignal", "EnemyDetected")
        public int value;       // Giá trị của tín hiệu đó
    }

    // Nơi Trung Tâm Lưu Trữ các Tín Hiệu lơ lửng trên Mạng Lưới Dây Cáp
    public class SignalNetwork : MonoBehaviour
    {
        // Danh sách các Tín hiệu đang chạy trong Mạng này (Mạng Dây Đỏ / Dây Xanh)
        public Dictionary<string, int> activeSignals = new Dictionary<string, int>();

        // Thiết bị truyền số vào mạng cáp
        public void SendSignal(string signalID, int value)
        {
            if (activeSignals.ContainsKey(signalID))
                activeSignals[signalID] += value; // Cộng dồn từ nhiều Cảm biến
            else
                activeSignals.Add(signalID, value);
        }

        // Thiết bị lấy số liệu từ mạng cáp
        public int ReadSignal(string signalID)
        {
            if (activeSignals.TryGetValue(signalID, out int value))
                return value;
            return 0; // Không tồn tại trên dây thì là 0
        }

        private void LateUpdate()
        {
            // Reset tín hiệu mỗi Frame để chống tắc mạch (Tín hiệu phải liên tục được Bơm vào ở hàm Update của các Sensor)
            activeSignals.Clear();
        }
    }
}

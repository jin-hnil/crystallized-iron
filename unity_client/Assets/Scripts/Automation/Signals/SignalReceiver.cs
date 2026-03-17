using UnityEngine;

namespace CrystallizedIron.Automation.Signals
{
    // Component cấy lên Máy Bơm, Đèn, Cửa (Bắt thiết bị đó phải tuân thủ Lệnh Điều Khiển)
    // Nếu thiết bị bị khóa bởi bộ thu này, nó sẽ tắt nguồn.
    public class SignalReceiver : MonoBehaviour
    {
        [Header("Connected Wire Network")]
        public SignalNetwork connectedNetwork; // Cáp nối từ mạch tín hiệu vào Máy

        [Header("Condition To Enable Machine")]
        public string listeningSignalID = "GreenPower"; // Lắng nghe một loại ID
        public LogicOperator operatorType = LogicOperator.GreaterThan;
        public int thresholdValue = 0; // Giá trị cắt ngàm cài đặt

        // Máy Bơm sẽ gọi hàm này trước khi quyết định Rút hay Không Rút đồ!
        public bool IsConditionMet()
        {
            // Nếu không gắn cáp Tín Hiệu, máy luôn luôn được phép Chạy tự do (Mặc định)
            if (connectedNetwork == null) return true;

            int currentSignalScore = connectedNetwork.ReadSignal(listeningSignalID);

            switch (operatorType)
            {
                case LogicOperator.GreaterThan: return currentSignalScore > thresholdValue;
                case LogicOperator.LessThan: return currentSignalScore < thresholdValue;
                case LogicOperator.Equals: return currentSignalScore == thresholdValue;
                case LogicOperator.NotEquals: return currentSignalScore != thresholdValue;
                default: return false;
            }
        }
    }
}

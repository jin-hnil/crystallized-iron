using UnityEngine;
using System.Collections.Generic;

namespace CrystallizedIron.Automation
{
    public class ElectricalGrid : MonoBehaviour
    {
        [Header("Power Plant Node")]
        public float powerOutputPerSec = 100f; // Watts
        public float fuelResourceLeft = 500f; // Xăng đá lưu huỳnh để máy nổ
        public float burnRate = 2f; 
        public bool isGenerating = false;

        // Lưu giữ những Máy Móc/Thiết Bị (Turret/Khoan/Đèn pha) được đấu dây đồng với cái máy Phát điện này.
        public List<AutoTurret> connectedTurrets = new List<AutoTurret>();
        public List<AutoDrill> connectedDrills = new List<AutoDrill>();

        private void Update()
        {
            if (fuelResourceLeft > 0)
            {
                isGenerating = true;
                fuelResourceLeft -= burnRate * Time.deltaTime;

                // Nối Điện (Powered) cho tất cả Turret
                foreach(var gun in connectedTurrets)
                {
                    if (gun != null) gun.isPowered = true;
                }
            }
            else
            {
                // Máy cắt sập nguồn
                isGenerating = false;
                foreach(var gun in connectedTurrets)
                {
                    if (gun != null) gun.isPowered = false;
                }

                foreach(var drill in connectedDrills)
                {
                    if (drill != null) drill.requiresPower = false; // Mất điện ngưng khoan
                }
            }
        }
    }
}

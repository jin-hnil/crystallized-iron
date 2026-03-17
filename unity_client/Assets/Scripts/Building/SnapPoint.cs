using UnityEngine;

namespace CrystallizedIron.Building
{
    public class SnapPoint : MonoBehaviour
    {
        public enum SnapType { Foundation, Wall, Ceiling, Conveyor, Pipe }

        [Header("Snap Configuration")]
        public SnapType type;
        public float snapRadius = 1.5f;

        // Draw a visual gizmo in the Unity Editor for developers
        private void OnDrawGizmos()
        {
            Gizmos.color = Color.green;
            Gizmos.DrawWireSphere(transform.position, snapRadius * 0.2f);
        }
    }
}

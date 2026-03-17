using UnityEngine;
using UnityEngine.EventSystems;
using UnityEngine.UI;

namespace CrystallizedIron.Inventory
{
    public class DragDropItem : MonoBehaviour, IBeginDragHandler, IDragHandler, IEndDragHandler
    {
        [Header("UI References")]
        public Image icon;
        public Transform originalParent;
        
        private Canvas canvas;
        private CanvasGroup canvasGroup;
        public int sourceSlotIndex = -1;

        private void Awake()
        {
            canvas = GetComponentInParent<Canvas>();
            canvasGroup = GetComponent<CanvasGroup>();
            if (canvasGroup == null)
            {
                canvasGroup = gameObject.AddComponent<CanvasGroup>();
            }
        }

        public void OnBeginDrag(PointerEventData eventData)
        {
            // Ghi nhớ vị trí cũ trước khi nhấc lên
            originalParent = transform.parent;
            
            // Lôi Icon ra khỏi ô lưới, nổi lên lớp ngoài cùng của Canvas để không bị che khuất
            transform.SetParent(transform.root);
            transform.SetAsLastSibling();

            // Cho phép tia chuột xuyên qua ảnh khi đang cầm để dễ dàng drop vào ô bên dưới
            canvasGroup.blocksRaycasts = false;
        }

        public void OnDrag(PointerEventData eventData)
        {
            // Di chuyển Icon bám sát theo vị trí chuột (Có bù trừ tỷ lệ Canvas)
            if (canvas.renderMode == RenderMode.ScreenSpaceOverlay)
            {
                transform.position = Input.mousePosition;
            }
            else // (ScreenSpaceCamera hoặc WorldSpace)
            {
                Vector2 pos;
                RectTransformUtility.ScreenPointToLocalPointInRectangle(canvas.transform as RectTransform, Input.mousePosition, canvas.worldCamera, out pos);
                transform.position = canvas.transform.TransformPoint(pos);
            }
        }

        public void OnEndDrag(PointerEventData eventData)
        {
            canvasGroup.blocksRaycasts = true;

            // Nếu không thả trúng một ô thả hợp lệ nào (DropSlot), thì trả về vị trí cũ
            if (transform.parent == transform.root)
            {
                transform.SetParent(originalParent);
                transform.localPosition = Vector3.zero;
            }
        }
    }
}

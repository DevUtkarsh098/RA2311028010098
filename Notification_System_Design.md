# Stage 1: Notification System Design

## Overview
To efficiently maintain the top `n` most important notifications from a continuous stream of incoming notifications, I have implemented a **Min-Heap (Priority Queue)** approach.

## Priority Logic
Priority is determined by a combination of two factors:
1. **Weight**: Evaluated first based on the notification type. `Placement` > `Result` > `Event`.
2. **Recency**: If weights are equal, the `Timestamp` is compared. Newer notifications have higher priority.

## Algorithm: Min-Heap
A naive approach would involve appending every incoming notification to an array and re-sorting it (`O(N log N)` where `N` is the total number of notifications). This becomes extremely inefficient as `N` grows continuously.

Instead, we use a Min-Heap of a fixed size `n` (the limit, e.g., 10):
- **Why a Min-Heap?**: A Min-Heap of size `n` keeps the *least* important notification of the top `n` at its root. 
- When a new notification arrives, we simply compare it to the root of the heap.
- If the new notification is less important than the root, we immediately discard it (`O(1)` time).
- If the new notification is more important than the root, we replace the root with the new notification and heapify downwards (`O(log n)` time).

## Complexities
- **Time Complexity**: 
  - Processing a new incoming notification takes **$O(\log n)$** time in the worst case, and $O(1)$ in the best case.
  - Getting the sorted top `n` notifications takes **$O(n \log n)$** time. Since `n` is very small (e.g., 10), this is practically instantaneous.
- **Space Complexity**: **$O(n)$**. The memory footprint is strictly bounded by `n`, regardless of how many thousands of notifications flow through the system. We do not store discarded notifications.

This approach ensures the system can handle a high-volume, real-time stream of incoming notifications extremely efficiently without memory leaks or degrading performance.
